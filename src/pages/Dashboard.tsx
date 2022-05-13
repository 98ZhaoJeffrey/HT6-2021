import React, { useState, useEffect, useContext} from "react";
import {
    Box,
    Grid,
    Button,
    Heading,
    Avatar,
    Input,
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
    Text,
    Table,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorModeValue
} from "@chakra-ui/react";
import firebase from "../firebase";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Unit } from "../ts/types";
import {Ingredients} from "../ts/interfaces";
import {AuthContext} from "../contexts/AuthContext";
import { useIngredientsListContext} from "../contexts/IngredientsListContext";
import { DeleteIcon } from "@chakra-ui/icons";

const units: Unit[] = ["ea", "ml", "L", "oz", "pt", "qt", "gals", "lbs", "mg", "gram", "kg", "tsp", "tbsp", "c"]

const Dashboard = () => {
    const user = useContext(AuthContext);
    
    // setting and modifying ingredients
    const [ingredients, setIngredients] = useIngredientsListContext()[0];
    //useState<Ingredients[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>("");
    const [newUnit, setNewUnit] = useState<Unit>({} as Unit);
    
    // setting and creating lists
    const [newList, setNewList] = useState<string>("");

    const [currentList, setCurrentList] = useIngredientsListContext()[1];
    const [ingredientLists, setIngredientLists] = useState<{ [key: string]: Ingredients[]} >({});

    //for switching tabs
    const [currentTab, setCurrentTab] = useState<number>(0);

    const toast = useToast();
    const ref = firebase.firestore().collection("users").doc(user!.uid);

    const updateList = (updatedIngredients: Ingredients[]) => {
        ingredientLists[currentList] = updatedIngredients;
        console.table(ingredientLists)
        ref.update({lists: ingredientLists});
        setIngredients(updatedIngredients);
        setIngredientLists(ingredientLists);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const amount = e.target.value === "" ? 0 : parseInt(e.target.value);

        // find the ingredient that changed
        const updatedIngredients: Ingredients[] = ingredients.map((ingredient) =>
            ingredient.name === name
                ? { ...ingredient, amount: amount}
                : ingredient
        );
        // update changed ingredient to new amount
        updateList(updatedIngredients);
    };

    const updateUnit = (name: string, unit: Unit) => {
        
        const updatedIngredients: Ingredients[] = ingredients.map((ingredient) =>
        ingredient.name === name
            ? { ...ingredient, unit: unit}
            : ingredient
        );
        // update changed ingredient to new amount    
        updateList(updatedIngredients);
    }

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
            const findMatchingIngredient = ingredients.find((ingredient: Ingredients) => ingredient.name === newIngredient.toLowerCase());
            if(findMatchingIngredient){
                toast({
                    title: "Ingredient already exists",
                    description: `Ingredient ${newIngredient} already exists in your list`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            else{
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
    }

    const deleteIngredient = (name: string) => {
        const updatedIngredients: Ingredients[] = ingredients.filter(
            (ingredient) => ingredient.name !== name
        );
        updateList(updatedIngredients);
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
            setCurrentList(newList)
            setIngredients(ingredientLists[newList]);
            setNewList("");
            setCurrentTab(0);
        }
    }

    const selectList = () => {
        if(currentList === ""){
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
                description: `Ingredient list: ${currentList} has been loaded`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setCurrentTab(0);
            console.log(ingredientLists[currentList])
            setIngredients(ingredientLists[currentList])
        }
    }

    const deleteList = () => {
        delete ingredientLists[currentList]
        ref.update({lists: ingredientLists})
        setCurrentList("")
        setIngredients([]);
    }

    // get data from firebase and store into state
    useEffect(() => {
        console.log(user)
        ref.get().then((doc: firebase.firestore.DocumentData) => {
            if (doc.exists) {       
                setIngredientLists(doc.data().lists);
            }
            else{
                ref.set({favorites: [], history: [], lists: {"My first list" : []}});
                console.log("Initialize user");
                setIngredientLists({"My first list" : []});
            }                
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            bg={useColorModeValue("brand.light", "brand.dark")}
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            py="2rem"
            px="5vw"
            h="92vh"
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
                        src={user!.photoURL!}
                    />
                    <Heading mt="5px" mb="20px">
                        {user!.displayName}
                    </Heading>
                    <Button
                        mt="20px"
                        onClick={() => firebase.auth().signOut()}
                        colorScheme="red"
                    >
                        Log Out
                    </Button>
                </Box>
                <Tabs
                    isFitted
                    variant='enclosed'
                    index={currentTab}
                    onChange={(index: number) => setCurrentTab(index)}
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
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewIngredient(e.target.value)}
                                />
                                <Select
                                    placeholder="Select Unit"
                                    value={newUnit}
                                    onChange={(e: { target: { value: string; }; }) => setNewUnit(e.target.value as Unit)}
                                >
                                    {units.map((unit) => {
                                        return <option value={unit}>{unit}</option>
                                    })}
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
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewList(e.target.value)}
                                />
                                <Select
                                    placeholder="Select your list"
                                    value={currentList}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrentList(e.target.value)}
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
            <Table>
                <Thead>
                    <Tr>
                    <Th>Food Name</Th>
                    <Th>Quantity</Th>
                    <Th isNumeric>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {ingredients && ingredients.map((ingredient) =>{
                        return(
                            <Tr>
                                <Td>
                                    {ingredient.name}
                                </Td>
                                <Td>                        
                                    <InputGroup>
                                        <Input
                                            value={ingredient.amount}
                                            name={ingredient.name}
                                            type="number"
                                            onChange={handleChange}
                                        >
                                        </Input>
                                        <InputRightAddon children={ingredient.unit} />
                                    </InputGroup>
                                </Td>
                                <Td isNumeric>
                                    <ButtonGroup>
                                        <Menu>
                                            <MenuButton as={Button} colorScheme={'green'} rightIcon={<ChevronDownIcon />}>
                                                Switch Unit
                                            </MenuButton>
                                            <MenuList>
                                                {units.map((unit)=>{
                                                    return <MenuItem onClick={()=>{updateUnit(ingredient.name, unit)}}>{unit}</MenuItem>
                                                })}
                                            </MenuList>
                                        </Menu>
                                        <Button colorScheme={'red'} onClick={() => {deleteIngredient(ingredient.name)}} rightIcon={<DeleteIcon/>}>Delete</Button>
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
                <Tfoot >
                    <Button 
                        mt="2rem" 
                        colorScheme={'red'} 
                        variant={'outline'} 
                        onClick={() => {deleteList()}} 
                        rightIcon={<DeleteIcon/>}>
                            Delete list
                    </Button>
                </Tfoot>
                </Table>
        </Box>
    );
};

export default Dashboard;
