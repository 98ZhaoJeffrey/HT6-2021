import React, { useState, useEffect} from "react";
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
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import {Recipe, Review, Ingredients} from "../ts/interfaces";
import {Unit} from "../ts/types"
import ExampleRecipe from "./ExampleRecipe.json"
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import Reviews from "../components/Reviews";
import firebase from "firebase";

//make it so we can push to user history after finish making


//i have no idea why we need this to work
type RecipeID = {
    id: string
}

const RecipePage = () => {
    const [servings, setServings] = useState<number>(1);
    const [ingredients, setIngredients] = useIngredientsListContext()[0];
    const [recipeData, setRecipeData] = useState<Recipe>({} as Recipe);
    const { id } = useParams<RecipeID>();

    useEffect(() => {
        console.log(id);
        const data = ExampleRecipe;
        const recipe = data.find(x => x.id === id);
        if(recipe != null){
            setRecipeData({
                "id": recipe["id"],
                "name": recipe["name"],
                "description": recipe["description"],
                "image": recipe["image"],
                "steps": recipe["steps"],
                "time": recipe["time"],
                "ingredients": recipe["ingredients"].map((ingredient) => {
                    return{
                        "name": ingredient["name"],
                        "amount": ingredient["amount"],
                        "unit": ingredient["unit"] as Unit
                    }
                })
            });
        }
    }, []);

    return (
        <Center w="100%">
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
                    />
                    <Box mt="2rem">
                        <Text fontSize="2xl">Ingredients</Text>
                        <Flex direction="row" my="1rem">
                            <Text fontSize="xl" mr="1rem">
                                Servings
                            </Text>
                            <NumberInput
                                min={1}
                                w="20%"
                                value={servings}
                                onChange={(value) => setServings(parseInt(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>

                        <Stack spacing={4} direction="column">
                            {recipeData.ingredients
                                ? recipeData.ingredients.map((ingredient) => (
                                      <Checkbox
                                          colorScheme="green"
                                          size="lg"
                                          defaultIsChecked
                                      >
                                          {ingredient.amount * servings}{" "}
                                          {ingredient.unit} {ingredient.name}
                                      </Checkbox>
                                  ))
                                : null}
                        </Stack>
                    </Box>
                </Flex>
                <Box w={["90%", null, "50%"]} mt={["2rem", null, "0"]}>
                    <Text fontSize="2xl">Instructions</Text>
                    <Stack
                        spacing={4}
                        direction="column"
                        divider={<StackDivider borderColor="gray.200" />}
                    >
                        {recipeData.steps
                            ? recipeData.steps.map((step, index) => (
                                  <Box>
                                      <Checkbox colorScheme="green" size="lg">
                                          Step {index + 1}
                                      </Checkbox>
                                      <Text fontSize="lg">{step}</Text>
                                  </Box>
                              ))
                            : null}
                    </Stack>
                    <Button mt="2rem">
                        <Link to="/dashboard">I made this recipe!</Link>
                    </Button>
                    <Reviews/>
                </Box>
            </Flex>
        </Center>
    );
};

export default RecipePage;
