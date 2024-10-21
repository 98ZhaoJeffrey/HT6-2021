import React, { FC } from 'react';
import { Input, Textarea, Stack, Heading } from '@chakra-ui/react';
import ImageUpload from '../ImageUpload';
import TimeInput from '../TimeInput';

interface ImageFormProps {
  formData: { image: string; title: string; description: string };
  handleChange: (name: string, value: any) => void;
}

const ImageForm: FC<ImageFormProps> = ({ formData, handleChange }) => {

  return (
    <Stack spacing={4} w={"100%"}>
      <Heading size="md">Step 1: Upload Image and add basic details</Heading>
      <Input
        placeholder="Recipe Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <Textarea
        placeholder="Recipe Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
      <TimeInput handleChange={handleChange}/>
      <ImageUpload onImageUpload={(image) => handleChange('image', image)}/>
    </Stack>
  );
};

export default ImageForm;