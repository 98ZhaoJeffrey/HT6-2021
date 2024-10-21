import React, { useState, useEffect, useContext, useRef} from "react";
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
    IconButton,
    useColorModeValue,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay
} from "@chakra-ui/react";
import { auth, firestore} from "../firebase";
import { ChevronDownIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {MdUndo, MdRedo} from "react-icons/md";
import { HistoryAction, Unit } from "../ts/types";
import {IngredientHistory, Ingredients} from "../ts/interfaces";
import {AuthContext} from "../contexts/AuthContext";
import { useIngredientsListContext} from "../contexts/IngredientsListContext";
import HistoryStack from "../utils/history";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { conversion } from "../utils/unitConversion";
import units from "../constants/units";

const Dashboard = () => {
    const user = useContext(AuthContext);
    
    // setting and modifying ingredients
    const [ingredients, setIngredients] = useIngredientsListContext()[0];

    const [newIngredient, setNewIngredient] = useState<string>("");
    const [newUnit, setNewUnit] = useState<Unit>({} as Unit);
    
    // setting and creating lists
    const [newList, setNewList] = useState<string>("");

    const [currentList, setCurrentList] = useIngredientsListContext()[1];
    const [ingredientLists, setIngredientLists] = useState<{ [key: string]: Ingredients[]} >({});
        
    const [currentTab, setCurrentTab] = useState<number>(0);

    const toast = useToast();

    const ref = doc(firestore, 'users', user!.uid);

    const [history] = useState(new HistoryStack<IngredientHistory>());

    const [prevHistoryEntry, setPrevHistoryEntry] = useState<IngredientHistory>({} as IngredientHistory);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const saveList = async () => {
        history.clearAll();
        setPrevHistoryEntry({} as IngredientHistory);
        updateDoc(ref, {lists: ingredientLists});
    }

    const updateList = async (name: string, updates: Ingredients | Object | null) => {
        const index = ingredients.findIndex((ingredient) => ingredient.name === name);
        const updatedIngredients = [...ingredients];
        const updatedIngredientLists = {...ingredientLists};

        if(updates === null){
            history.push({
                action: HistoryAction.DELETE,
                prev: updatedIngredients[index],
                name: name
            });
            updatedIngredients.splice(index, 1);
        }
        else if(index !== -1){
            const changed = Object.keys(updates)[0];
            history.push({
                action: changed === "amount" ? HistoryAction.AMOUNT : HistoryAction.UNITS,
                prev: updatedIngredients[index],
                name: name
            });
            updatedIngredients[index] = { ...updatedIngredients[index], ...updates};
        }
        else{
            history.push({
                action: HistoryAction.NEW,
                prev: null,
                name: name
            });
            updatedIngredients.push(updates as Ingredients);
        }
        
        updatedIngredientLists[currentList] = updatedIngredients;
        setIngredients(updatedIngredients);
        setIngredientLists(updatedIngredientLists);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const amount = e.target.value === "" ? 0 : parseInt(e.target.value);
        // update changed ingredient to new amount
        updateList(name, {amount: amount});
    };

    const updateUnit = (name: string, amount: number, oldUnit: Unit, newUnit: Unit) => {
        // update changed ingredient to new amount  
        try{
            const newAmount = conversion(amount, oldUnit, newUnit)
            updateList(name, {amount: newAmount, unit: newUnit});
        } catch (e){
            if (e instanceof Error) {
                toast({
                    title: "Invalid conversion",
                    description: e.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }   
    }

    // add new ingredient created by user to dashboard and firebase
    const addIngredient = async () => {
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
                updateList(newIngredient, ingredient);
                setNewIngredient("");
                setNewUnit({} as Unit);
            }
        }
    }

    const deleteIngredient = (name: string) => {
        updateList(name, null);
    }

    const addList = async () => {
        toast({
            title: "Ingredient list Added!",
            description: `Ingredient list ${newList} has been added!`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        ingredientLists[newList] = [];
        updateDoc(ref, {lists: ingredientLists});
        setIngredientLists(ingredientLists)
        setCurrentList(newList)
        setIngredients(ingredientLists[newList]);
        setNewList("");
        setCurrentTab(0);
    }

    const selectList = (list: string) => {
        if(detectChange()){
            toast({
                title: "Save updates list",
                description: "You made some updates, save or discard them first",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setCurrentList(list);
        if(list === ""){
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
                description: `Ingredient list: ${list} has been loaded`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setCurrentTab(0);
            setIngredients(ingredientLists[list]);
            setPrevHistoryEntry({} as IngredientHistory);
            history.clearAll();
        }
    }

    const deleteList = async () => {
        delete ingredientLists[currentList];
        setCurrentList("");
        setIngredients([]);
        saveList();
    }

    const detectChange = () => {
        // might need to change this so keep for now
        return !history.historyEmpty();
    }
    const discardChanges = () => {
        // undo all changes first
        const updatedIngredientLists = {...ingredientLists};
        let updatedIngredients: Ingredients[] = [...ingredients];                
        while(!history.historyEmpty()){
            let undo = history.undo();
            if(undo){
                updatedIngredients = updateWIthHistory({action: undo.action, name: undo.name, prev: undo.prev, undo: true}, updatedIngredients);   
            }
        }
        history.clearAll();
        setPrevHistoryEntry({} as IngredientHistory);        
        updatedIngredientLists[currentList] = updatedIngredients;
        setIngredients(updatedIngredients);
        setIngredientLists(updatedIngredientLists);
    }

    // get data from firebase and store into state
    useEffect(() => { 
        const getData = async () => {
            const data = await getDoc(ref);
            if(data.exists()){
                setIngredientLists(data.data()['lists']);
            }
        }
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateWIthHistory = (update: IngredientHistory, updatedIngredients: Ingredients[]) => {
        // error right now is that if we did 4 -> 42, then undo it, we wont have access to 42 later
        // need to get the ingredients current data and save it
        const index = ingredients.findIndex((ingredient) => ingredient.name === update.name);
        const currIngredient = ingredients[index];

        // trust this works
        if(update.action === HistoryAction.AMOUNT || update.action === HistoryAction.UNITS){
            updatedIngredients[index] = { ...updatedIngredients[index], ...update.prev};
            if(update.undo){
                history.futurePush({action: update.action, name: update.name, prev: currIngredient});
            }else {
                history.historyPush({action: update.action, name: update.name, prev: currIngredient});
            }
        }
        else if(update.action === HistoryAction.NEW) {
            if(update.undo){
                // undo new = delete
                updatedIngredients.splice(index, 1);
                history.futurePush({action: update.action, name: update.name, prev: currIngredient});
            }else {
                updatedIngredients.push(update.prev as Ingredients);
                history.historyPush({action: update.action, name: update.name, prev: currIngredient});
            }
        }
        else if(update.action === HistoryAction.DELETE){
            if(update.undo){
                // undo delete = new
                updatedIngredients.push(update.prev as Ingredients);
                history.historyPush({action: update.action, name: update.name, prev: currIngredient});
            }else {
                updatedIngredients.splice(index, 1);
                history.futurePush({action: update.action, name: update.name, prev: currIngredient});
            }
        }

        return updatedIngredients;
    } 

    useEffect(() => {
        if(!ingredients) return;
        
        const updatedIngredients = updateWIthHistory(prevHistoryEntry, [...ingredients])
        const updatedIngredientLists = {...ingredientLists};                
        updatedIngredientLists[currentList] = updatedIngredients;
        setIngredients(updatedIngredients);
        setIngredientLists(updatedIngredientLists);
    }, [prevHistoryEntry]);

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
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => {
                    deleteList();
                    onClose();
                }}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete {currentList}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        colorScheme='red'                 
                        onClick={() => {
                            deleteList();
                            onClose();
                        }} 
                        ml={3}
                    >
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
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
                        onClick={() => signOut(auth)}
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
                                    disabled={currentList === ""}
                                />
                                <Select
                                    placeholder="Select Unit"
                                    value={newUnit}
                                    disabled={currentList === ""}
                                    onChange={(e: { target: { value: string; }; }) => setNewUnit(e.target.value as Unit)}
                                >
                                    {units.map((unit) => {
                                        return <option value={unit}>{unit}</option>
                                    })}
                                </Select>
                                <Button colorScheme="green" onClick={() => addIngredient()} disabled={currentList === ""}>
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
                                    onChange={(e: { target: { value: string; }; }) => { 
                                            selectList(e.target.value);
                                        }
                                    }
                                >
                                    {Object.keys(ingredientLists).map((listName)=>{
                                        return <option value={listName}>{listName}</option>

                                    })}
                                </Select>
                                <ButtonGroup>
                                    <Button colorScheme="green" w="50%"  onClick={() => addList()} disabled={currentList === ""}>
                                        Create
                                    </Button>
                                    <Button 
                                        colorScheme={'red'}
                                        w="50%" 
                                        onClick={() => {deleteList()}} 
                                        disabled={currentList === ""}
                                    >
                                        Delete list
                                    </Button> 
                                </ButtonGroup>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Grid>
            {currentList !== "" && 
                <>
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
                                                            return <MenuItem onClick={()=>{updateUnit(ingredient.name, ingredient.amount, ingredient.unit, unit)}}>{unit}</MenuItem>
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
                            <ButtonGroup spacing='3' mt="2rem">
                                <Button 
                                    colorScheme={'green'} 
                                    onClick={() => saveList()} 
                                    rightIcon={<EditIcon/>}
                                    variant='outline'
                                >
                                    Save
                                </Button>
                                <Button 
                                    colorScheme={'red'} 
                                    onClick={onOpen} 
                                    rightIcon={<DeleteIcon/>}
                                    variant='outline'
                                >
                                    Delete list
                                </ Button>
                                <IconButton aria-label='Undo' icon={<MdUndo />} disabled={history.historyEmpty()} onClick={() => 
                                    {   
                                        const undo = history.undo();
                                        if(undo){
                                            setPrevHistoryEntry({action: undo.action, name: undo.name, prev: undo.prev, undo: true});
                                        }
                                    }
                                } />
                                <IconButton aria-label='Redo' icon={<MdRedo />} disabled={history.futureEmpty()} onClick={() => 
                                    {
                                        const redo = history.redo();
                                        if(redo){
                                            setPrevHistoryEntry({action: redo.action, name: redo.name, prev: redo.prev, undo: false});
                                        }
                                    }
                                } />
                                <IconButton aria-label='Discard changes' icon={<CloseIcon />} disabled={history.historyEmpty()} onClick={discardChanges} />
                            </ButtonGroup>
                        </Tfoot>
                    </Table>
                </>
            }
        </Box>
    );
};

export default Dashboard;