import React, { useState, useEffect} from "react";
import {
    chakra,
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
import firebase from "../firebase";
import {Recipe} from "../ts/interfaces";

//make it so we can push to user history after finish making


//i have no idea why we need this to work
type RecipeID = {
    id: string
}

const RecipePage = () => {
    const [servings, setServings] = useState<number>(1);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipe, setRecipe] = useState<Recipe>({} as Recipe);
    const { id } = useParams<RecipeID>()
    const ref = firebase.firestore().collection("recipes").doc(id);
    useEffect(() => {
        console.log(id);
        ref.get().then(function (doc:any) {
            if (doc.exists) {
                setRecipe(doc.data().data);
                console.log(doc.data().data);
            } else {
            }
        });
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
                        {recipe.name}
                    </Heading>
                    <Image
                        src={recipe.image}
                        fallbackSrc="https://via.placeholder.com/150"
                        boxSize="50vh"
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
                                min={0}
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
                            {recipe.ingredients
                                ? recipe.ingredients.map((ingredient) => (
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
                        {recipe.steps
                            ? recipe.steps.map((step, index) => (
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
                </Box>
            </Flex>
        </Center>
    );
};

export default RecipePage;
