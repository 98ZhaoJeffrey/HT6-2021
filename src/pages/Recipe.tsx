import React, { useState, useEffect, useContext} from "react";
import {
    Box,
    Button,
    Image,
    Flex,
    Text,
    Stack,
    StackDivider,
    Checkbox,
    Heading,
    Center,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    IconButton,
    UnorderedList,
    ListItem,
    useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {Recipe, Ingredients, Page} from "../ts/interfaces";
import {Unit} from "../ts/types"
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import Reviews from "../components/Reviews";
import { firebase, firestore } from "../firebase";
import {AuthContext} from "../contexts/AuthContext";
import { InfoIcon } from "@chakra-ui/icons";
import VSteps from "../components/VSteps";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

//i have no idea why we need this to work
type RecipeID = {
    id: string
}

type EnoughIngredient = "Has required amount of ingredient" | "Does not have required amount of ingredient" | "Does not have the ingredient"; 

const colors = {
    "Has required amount of ingredient" : "green",
    "Does not have required amount of ingredient": "yellow",
    "Does not have the ingredient": "red"
}

const RecipePage = () => {
    const user = useContext(AuthContext);

    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useIngredientsListContext()[0];
    const [recipeData, setRecipeData] = useState<Recipe>({} as Recipe);
    const [favorites, setFavorites] = useState<Page[]>([]);
    const { id } = useParams<RecipeID>() as { id: string };
    const navigate = useNavigate();
    const ref = doc(firestore, "users", user!.uid);
    const recipeRef = doc(firestore, "recipe", id); 


    
    const hasEnoughIngredient = (searchIngredient: Ingredients): EnoughIngredient => {
        const found = ingredients.find(ingredient => searchIngredient.name.toLowerCase() === ingredient.name.toLowerCase());
        if(found !== undefined){
            return found.amount >= searchIngredient.amount * servings ? "Has required amount of ingredient" : "Does not have required amount of ingredient";
        }
        return "Does not have the ingredient";
    }

    const madeRecipe = () => {
        const updatedIngredients = ingredients.map((userIngredient: Ingredients) => {
            const found = recipeData.ingredients.find((recipeIngredient: Ingredients) => userIngredient.name.toLowerCase() === recipeIngredient.name.toLowerCase())
            if(found !== undefined){
                return {
                    "name": userIngredient.name,
                    "unit": userIngredient.unit,
                    "amount": Math.max(userIngredient.amount - found.amount * servings, 0)
                }                
            }
            return userIngredient;
        });
        
        getDoc(ref).then((doc) => {
            if (doc.exists()) {
                const history: Page[] = doc.data().history;
                if(history.length === 10){
                    history.pop();    
                }
                history.unshift({id: recipeData["id"], name: recipeData["name"], image: recipeData["image"]});
                console.log(history)
                updateDoc(ref, {...doc.data, lists: {...doc.data().lists, currentList: updatedIngredients}, history: history});
                setIngredients(updatedIngredients); 
            }
        });
        navigate('/dashboard');   
    };

    const saveRecipe = () => {
        const page = {id: recipeData["id"], name: recipeData["name"], image: recipeData["image"]};        
        getDoc(ref).then((doc) => {
            if (doc.exists()) {
                if(favorites.filter((element: Page) => { return element.id === recipeData["id"]}).length === 0){
                    console.log(doc.data());
                    console.log({...doc.data(), favorites: [page, ...favorites]});
                    setDoc(ref, {favorites: [page, ...favorites]}, {merge: true});
                    setFavorites(prev => [page, ...prev]);            
                }
                else{
                    setDoc(ref, {favorites: favorites.filter((element: Page) => { return element.id !== page.id})}, {merge: true});
                    setFavorites(favorites.filter((element: Page) => { return element.id !== page.id}));
                } 
            }
            else{
                setDoc(ref, {favorites: [page], history: [page], lists: {"My first list" : []}});
            }
        }).catch((error) =>{
            console.log(error)
        });
    };

    useEffect(() => {
        const getRecipe = async () => {
            try{
                const recipe = await getDoc(recipeRef);
                if(recipe.exists()){
                    const data = recipe.data();
                    console.log(data)
                     
                    //setRecipeData({
                    //    "id": id,
                    //    "name": data.get("name"),
                    //    "description": recipe["description"],
                    //    "image": recipe["image"],
                    //    "steps": recipe["steps"],
                    //    "time": recipe["time"],
                    //    "ingredients": recipe["ingredients"].map((ingredient: Ingredients) => {
                    //        return{
                    //            "name": ingredient["name"],
                    //            "amount": ingredient["amount"],
                    //            "unit": ingredient["unit"] as Unit
                    //        }
                    //    }),
                    //    "average": recipe["average"],
                    //    "reviewCount": recipe["reviewCount"]
                    //});
                    
                }

                const doc = await getDoc(ref);
                if (doc.exists()) {
                    setFavorites(doc.data().favorites);
                }
                console.log(ingredients)
            }catch (error) {
                console.log(error);
            }
        }
        getRecipe();
        if(ingredients === undefined){
            setIngredients([]);
        }
    }, [id]);

    return (
        <Center w="100%" bg={useColorModeValue("brand.light", "brand.dark")}>
            <Flex
                w="80%"
                direction={["column", null, "row"]}
                justifyContent="space-around"
                my="2rem"
            >
                <Flex direction="column">
                    <Heading textAlign={["center", null, "left"]}>
                        {recipeData.name}
                    </Heading>
                    <Image
                        src={recipeData.image}
                        fallbackSrc="https://via.placeholder.com/150"
                        boxSize={{base: "80vw", md: "40vw", lg:"25vw"}}
                        borderRadius="5%"
                        alignSelf="center"
                        objectFit="cover"
                        my="2rem"
                    />
                    <Box >
                        <Text fontSize="2xl">Ingredients</Text>
                        <Flex direction="row" my="1rem">
                            <Text fontSize="xl" mr="1rem">
                                Servings
                            </Text>
                            <NumberInput
                                min={1}
                                w="20%"
                                value={servings}
                                onChange={(value: string) => setServings(parseInt(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Popover
                                placement='right'
                            >
                            <PopoverTrigger>
                                <IconButton aria-label={"info"} variant="ghost" icon={<InfoIcon/>}/>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Whats with the colors?</PopoverHeader>
                                <PopoverBody>
                                    <UnorderedList>
                                        <ListItem><Text as="span" textColor='green'>Green checkmark</Text>: You have enough of the required ingredient</ListItem>
                                        <ListItem><Text as="span" textColor='yellow.600'>Yellow checkmark</Text>: You have the ingredient but not enough of it </ListItem>
                                        <ListItem><Text as="span" textColor='red'>Red/No checkmark</Text>: You don't have this ingredient at all</ListItem>
                                    </UnorderedList>
                                </PopoverBody>
                            </PopoverContent>
                            </Popover>
                        </Flex>
                        <Stack spacing={4} direction="column">
                            {recipeData.ingredients && 
                                recipeData.ingredients.map((ingredient) => (
                                    <Checkbox
                                        colorScheme={colors[hasEnoughIngredient(ingredient)]}
                                        size="lg"
                                        defaultIsChecked={hasEnoughIngredient(ingredient) !== "Does not have the ingredient"}
                                    >
                                        {ingredient.amount * servings}{" "}
                                        {ingredient.unit} {ingredient.name}
                                    </Checkbox>
                                  ))
                            }
                        </Stack>
                    </Box>
                </Flex>
                <Box w={["90%", null, "50%"]} mt={["2rem", null, "0"]}>
                    <Text fontSize="2xl" mb={"2rem"}>Instructions</Text>
                    <Stack
                        spacing={4}
                        direction="column"
                        divider={<StackDivider borderColor="gray.200" />}
                    >
                        {
                            recipeData.steps &&
                            <VSteps steps={recipeData.steps}>
                                <Button onClick={madeRecipe}>
                                    I made this recipe!
                                </Button>
                                <Button colorScheme='green' onClick={saveRecipe}>
                                    {favorites.filter((element: Page) => { return element.id === recipeData["id"]}).length === 0 ? 'Save recipe' : 'Remove recipe'}
                                </Button>
                            </VSteps>
                        }
                    </Stack>
                    <Reviews average={recipeData["average"]} reviewCount={recipeData["reviewCount"]}/>
                </Box>
            </Flex>
        </Center>
    );
};

export default RecipePage;
