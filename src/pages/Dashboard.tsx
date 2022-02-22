import React, { useState, useEffect, useLayoutEffect} from "react";
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
    Stack,
    Tabs, 
    TabList,
    TabPanels, 
    Tab, 
    TabPanel,
    Text
} from "@chakra-ui/react";
import firebase from "../firebase";

import Unit from "../ts/types";
import {Ingredients} from "../ts/interfaces";
import { update } from "lodash";
import { stringify } from "querystring";

// get current logged in user
//change to react context later
const user:any = JSON.parse(localStorage.getItem("user") || '{}');


const Dashboard = () => {
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>("");
    const [newUnit, setNewUnit] = useState<Unit>({} as Unit);
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [newList, setNewList] = useState<string>("");
    const [selectedList, setSelectedList] = useState<string>("");
    const [currentList, setCurrentList] = useState<string>("");
    const [ingredientLists, setIngredientLists] = useState<Record<string, Ingredients[]>>({});

    const toast = useToast();
    const ref = firebase.firestore().collection("users").doc(user.uid);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const amount = e.target.value === "" ? 0 : parseInt(e.target.value);

        // find the ingredient that changed
        //console.log(ingredients)
        const updatedIngredients: Ingredients[] = ingredients.map((ingredient) =>
            ingredient.name === name
                ? { ...ingredient, amount: amount }
                : ingredient
        );
        // update changed ingredient to new amount
        
        ingredientLists[currentList] = updatedIngredients;
        console.log(ingredientLists)
        ref.update({lists: ingredientLists});
        setIngredients(updatedIngredients);
        setIngredientLists(ingredientLists);
        
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

            let updatedIngredients = ingredients;
            updatedIngredients.push(ingredient);
            setIngredients(updatedIngredients);
            ingredientLists[currentList] = updatedIngredients
            ref.update({lists: ingredientLists});
            setIngredientLists(ingredientLists)
            setNewIngredient("");
            setNewUnit({} as Unit);
        }
    }
    const addList = () => {
        if(newList === ""){
            toast({
                title: "Invalid name",
                description: "Your ingredient's list must have a name!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        else{
            toast({
                title: "Ingredient list Added!",
                description: `Ingredient list ${newList} has been added!`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            ingredientLists[newList] = [];
            ref.update({lists: ingredientLists});
            setIngredientLists(ingredientLists)
            setNewList("");
            setCurrentTab(0);
        }
    }

    const selectList = () =>{
        if(selectedList === ""){
            toast({
                title: "Invalid list",
                description: "Invalid ingredient list!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        else{
            toast({
                title: "Ingredient list loaded!",
                description: `Ingredient list: ${selectedList} has been loaded`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        setCurrentTab(0);
        setCurrentList(selectedList);
        //console.log(typeof(ingredientLists))
        console.log(selectedList)
        console.log(ingredientLists[selectedList])
        setIngredients(ingredientLists[selectedList])
        }
        setSelectedList("");
    }

    // get data from firebase and store into state
    useEffect(() => {
        ref.get().then(function (doc: firebase.firestore.DocumentData) {
            if (doc.exists) {
                console.log(doc.data().lists);       
                setIngredientLists(doc.data().lists);
            }
            else{
                firebase
                    .firestore()
                    .collection("users")
                    .doc(user.uid)
                    .set({ lists: {"My first list" : []}});
                console.log("Initialize user")
            }                
            console.log(doc.data().lists); 
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
            <Grid templateColumns="1fr 2fr" gap={10}>
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
                <Tabs
                    isFitted
                    variant='enclosed'
                    index={currentTab}
                    onChange={(index) => setCurrentTab(index)}
                >
                    <TabList>
                        <Tab>Add ingredient</Tab>
                        <Tab>Add/Select List</Tab>
                    </TabList>
                    <TabPanels height="100%">
                        <TabPanel height="100%">
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-evenly"
                                height="100%"
                            >
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
                        </TabPanel>
                        <TabPanel height="100%">
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-evenly"
                                height="100%"
                            >
                                <Input
                                    placeholder="Name of new list"
                                    value={newList}
                                    onChange={(e) => setNewList(e.target.value)}
                                />
                                <Select
                                    placeholder="Select your list"
                                    value={selectedList}
                                    onChange={(e) => setSelectedList(e.target.value)}
                                >
                                    {Object.keys(ingredientLists).map((listName)=>{
                                        return <option value={listName}>{listName}</option>

                                    })}
                                </Select>
                                <Stack direction="row" width="100%" spacing="1rem">
                                    <Button colorScheme="green" width="50%" onClick={() => addList()}>
                                        Create
                                    </Button>
                                    <Button colorScheme="green" width="50%" onClick={() => selectList()}>
                                        Select
                                    </Button>
                                </Stack>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Grid>
            <Text fontSize="3rem" fontWeight="600" mt="2rem">List: {currentList}</Text>
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
