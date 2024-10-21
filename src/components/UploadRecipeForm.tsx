import React, { useContext, useState } from 'react'
import { Box, Button, ButtonGroup, useColorModeValue, useToast, Text } from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom";
import ImageForm from './forms/UploadRecipeImageForm';
import StepsForm from './forms/UploadRecipeStepsForm';
import IngredientsForm from './forms/UploadRecipeIngredientsForm';
import { Ingredients } from '../ts/interfaces';
import { addDoc, collection, doc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { generateImageId } from '../utils/generateImageId';
import { AuthContext } from '../contexts/AuthContext';

interface FormData {
    image: string;
    title: string;
    description: string;
    steps: string[];
    ingredients: Ingredients[];
    duration: { hours: number, minutes: number },
}


const UploadRecipeForm = () => {
    const user = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();
    const recipeRef = collection(firestore, "recipes"); 
   
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        image: '',
        title: '',
        description: '',
        steps: [''],
        ingredients: [],
        duration: { hours: 0, minutes: 0 },
      });

    const handleNext = () => setCurrentStep((prev) => prev + 1);
    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleChange = (name: string, value: any) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      try {
        const recipeImageRef = ref(storage, `image/${generateImageId()}`);
        await uploadString(recipeImageRef, formData.image, 'data_url')
        const downloadURL = await getDownloadURL(recipeImageRef);
        
        const docRef = await addDoc(recipeRef, {
          name: formData.title,
          description: formData.description,
          image: downloadURL,
          average: 0,
          reviewCount: 0,
          ingredients: formData.ingredients,
          steps: formData.steps,
          time: 3600 * formData.duration.hours + 60 * formData.duration.minutes,
          author: user!.uid
        });
        navigate(`/recipe/${docRef.id}`);
      } catch (e) {
          toast({
            status: "error",
            title: 'Error',
            description: "There was an error uploading your recipe, please try again.",
            duration: 5000,
            isClosable: true,
          })
      }

      // redirect

    }

    const renderStep = () => {
        switch (currentStep) {
          case 1:
            return <ImageForm formData={formData} handleChange={handleChange} />;
          case 2:
            return <StepsForm formData={formData} handleChange={handleChange} />;
          case 3:
            return <IngredientsForm formData={formData} handleChange={handleChange} />;
        }
      };

    return <Box display="flex" flexDirection="column" bg={useColorModeValue("brand.light", "brand.dark")} h="92vh" alignItems="center" w={"70%"} mt="6">
        {renderStep()}
        <ButtonGroup mt={6}>
        {currentStep > 1 && (
          <Button onClick={handleBack} colorScheme="red">
            Previous step
          </Button>
        )}
        {currentStep < 3 ? (
          <Button onClick={handleNext} colorScheme="green">
            Next step
          </Button>
        ) : (
          <Button onClick={handleSubmit} colorScheme="green">
            Submit
          </Button>
        )}
      </ButtonGroup>
    </Box>
}

export default UploadRecipeForm