import React, { useState, useEffect} from "react";
import {
    Box,
    Grid,
    Button,
    Heading,
    Avatar,
    Input,
    FormControl,
    FormLabel,
    InputRightAddon,
    InputGroup,
    Select,
    useToast,
} from "@chakra-ui/react";
import firebase from "../firebase";

import Unit from "../ts/types";
import {Ingredients} from "../ts/interfaces";

// get current logged in user
//change to react context later
const user = JSON.parse(localStorage.getItem("user") || '{}');


const Dashboard = () => {
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>("");
    const [newUnit, setNewUnit] = useState<Unit>({} as Unit);
    const toast = useToast();
    const ref = firebase.firestore().collection("users").doc(user.uid);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const amount = e.target.value === "" ? 0 : parseInt(e.target.value);

        // find the ingredient that changed
        const updatedIngredients: Ingredients[] = ingredients.map((ingredient) =>
            ingredient.name === name
                ? { ...ingredient, amount: amount }
                : ingredient
        );
        console.log(updatedIngredients)
        // update changed ingredient to new amount
        setIngredients(updatedIngredients);
        ref.update({ ingredients: updatedIngredients });
    };
    // add new ingredient created by user to dashboard and firebase
    const addIngredient = () => {
        const ingredient: Ingredients = {
            name: newIngredient.toLowerCase(),
            amount: 0,
            unit: newUnit,
        };
        // make sure ingredient has name and unit
        if (ingredient.name === "") {
            toast({
                title: "Invalid name",
                description: "Your ingredient must have a name!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else if (newUnit === null) {
            toast({
                title: "Invalid unit",
                description: "Your ingredient must have a unit!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Ingredient Added!",
                description: `Ingredient ${newIngredient} has been added!`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setNewIngredient("");
            setNewUnit({} as Unit);
            let updatedIngredients = ingredients;
            updatedIngredients.push(ingredient);
            setIngredients(updatedIngredients);
            ref.update({ ingredients: updatedIngredients });
        }
    }
    // get data from firebase and store into state
    useEffect(() => {
        ref.get().then(function (doc: any) {
            if (doc.exists) {
                setIngredients(doc.data().ingredients);
            } else {
                firebase
                    .firestore()
                    .collection("users")
                    .doc(user.uid)
                    .set({ ingredients: [] });
            }
        });
    }, []);
    return (
        <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            my="2rem"
            px="5vw"
        >
            <Grid templateColumns="2fr 1fr" gap={6}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Avatar
                        name=""
                        size="xl"
                        src={JSON.parse(localStorage.getItem("user") || "{}").photoURL}
                    />
                    <Heading mt="5px" mb="20px">
                        {user.displayName}
                    </Heading>
                    <Button
                        mt="20px"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        colorScheme="red"
                    >
                        Log Out
                    </Button>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-evenly"
                >
                    <FormLabel>Add Ingredient</FormLabel>
                    <Input
                        placeholder="e.g tomato"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                    />
                    <Select
                        placeholder="Select Unit"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value as Unit)}
                    >
                        <option value="ea">ea</option>
                        <option value="mL">mL</option>
                        <option value="L">L</option>
                        <option value="lbs">lbs</option>
                        <option value="oz">oz</option>
                        <option value="pt">pt</option>
                        <option value="gal">gal</option>
                        <option value="qt">qt</option>
                        <option value="tsp">tsp</option>
                        <option value="c">C</option>
                        <option value="mg">mg</option>
                        <option value="gram">gram</option>
                        <option value="tbsp">tbsp</option>
                    </Select>
                    <Button colorScheme="green" onClick={() => addIngredient()}>
                        Add
                    </Button>
                </Box>
            </Grid>
            <Grid templateColumns="repeat(4, 1fr)" gap={6} my="50px">
                {ingredients.map((ingredient) => (
                    <FormControl key={ingredient.name}>
                        <FormLabel>{ingredient.name}</FormLabel>
                        <InputGroup>
                            <Input
                                value={ingredient.amount}
                                name={ingredient.name}
                                type="number"
                                onChange={handleChange}
                            ></Input>
                            <InputRightAddon children={ingredient.unit} />
                        </InputGroup>
                    </FormControl>
                ))}
            </Grid>
        </Box>
    );
};

export default Dashboard;
