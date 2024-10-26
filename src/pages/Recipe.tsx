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
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tr,
    Thead,
    Th,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {Recipe, Ingredients, Page} from "../ts/interfaces";
import {Unit} from "../ts/types"
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import Reviews from "../components/Reviews";
import { firestore } from "../firebase";
import {AuthContext} from "../contexts/AuthContext";
import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import { RecipeSteps } from "../components/RecipeSteps";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { commonConversion, conversionsTo } from "../utils/unitConversion";
import * as PageRoutes from "../constants/routes";
import { formatTimeString, formatTime } from "../utils/formatTime";
import CookingTime from "../components/CookingTime";

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
    const [recipeIngredients, setRecipeIngredients] = useState<Record<"metric" | "imperial" , Ingredients[]>>();
    const [units, setUnits] = useState<"metric" | "imperial">("metric");
    const [favorites, setFavorites] = useState<Page[]>([]);
    const { id } = useParams<RecipeID>() as { id: string };
    const navigate = useNavigate();
    const ref = doc(firestore, "users", user!.uid);
    const recipeRef = doc(firestore, "recipes", id); 

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
                updateDoc(ref, {...doc.data, lists: {...doc.data().lists, currentList: updatedIngredients}, history: history});
                setIngredients(updatedIngredients); 
            }
        });
        navigate(PageRoutes.DASHBOARD_PAGE);
    };

    const saveRecipe = () => {
        const page = {id: recipeData["id"], name: recipeData["name"], image: recipeData["image"]};        
        getDoc(ref).then((doc) => {
            if (doc.exists()) {
                if(favorites.filter((element: Page) => { return element.id === recipeData["id"]}).length === 0){
                    setDoc(ref, {favorites: [page, ...favorites]}, {merge: true});
                    setFavorites(prev => [page, ...prev]);            
                }
                else{
                    setDoc(ref, {favorites: favorites.filter((element: Page) => { return element.id !== page.id})}, {merge: true});
                    setFavorites(favorites.filter((element: Page) => { return element.id !== page.id}));
                } 
            }
        }).catch((error) =>{
            console.log(error)
        });
    };
    
    const swapUnits = () => {
        if(units === "metric"){
            setUnits("imperial");
        }else{
            setUnits("metric");
        }
    }

    useEffect(() => {
        const getRecipe = async () => {
            try{
                const recipe = await getDoc(recipeRef);
                if(recipe.exists()){
                    const data = recipe.data();
                    console.log(data)
                    const ingredients = data["ingredients"].map((ingredient: Ingredients) => {
                        return{
                            "name": ingredient["name"],
                            "amount": ingredient["amount"],
                            "unit": ingredient["unit"] as Unit
                        }
                    })
                    setRecipeData({
                       "id": id,
                       "name": data["name"],
                       "description": data["description"],
                       "image": data["image"],
                       "steps": data["steps"],
                       "time": data["time"],
                       "ingredients": ingredients,
                       "average": data["average"],
                       "reviewCount": data["reviewCount"]
                    });
                    setRecipeIngredients({
                        "metric": ingredients,
                        "imperial": ingredients.map((ingredient: Ingredients) => {
                            const newValues = commonConversion(ingredient.amount, ingredient.unit);
                            return {...newValues, "name": ingredient.name}; 
                        })
                    }); 
                }
                const doc = await getDoc(ref);
                if (doc.exists()) {
                    setFavorites(doc.data().favorites);
                }
            }catch (error) {
                console.log(error);
            }
        }
        getRecipe();
        if(ingredients === undefined){
            setIngredients([]);
        }
    }, []);

    return (
        <Center w="100%" bg={useColorModeValue("brand.light", "brand.dark")} px="1rem">
            <Flex
                w="100%"
                direction={["column", null, "row"]}
                justifyContent="space-around"
                my="2rem"
            >
                <Flex direction="column" alignItems={["center", null, "start"]}>
                    <Heading textAlign={["center", null, "left"]}>
                        {recipeData.name}
                    </Heading>
                    <Image
                        src={recipeData.image}
                        fallbackSrc="https://via.placeholder.com/150"
                        alt={recipeData.name}
                        boxSize={{base: "80vw", md: "40vw", lg:"25vw"}}
                        borderRadius="5%"
                        objectFit="cover"
                        my="1rem"
                    />
                    <Flex my={2} direction="row" gap="2rem">
                        <CookingTime time={recipeData.time}/>
                        <Button colorScheme='green' onClick={saveRecipe}>
                            { favorites.find((element: Page) => element.id === recipeData["id"]) ? 'Remove recipe' : 'Save recipe' }
                        </Button>
                    </Flex>
                    
                    <Text fontSize="xl">
                        {recipeData.description}
                    </Text>
                    <Box >
                        <Flex direction="row" my="1rem">
                            <Text fontSize="2xl">Ingredients</Text>
                            <Spacer/>
                            <Text fontSize="2xl" mr="1rem">
                                Servings
                            </Text>
                            <NumberInput
                                min={1}
                                w="15%"
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
                        <Flex direction="row" my="1rem" gap="1rem">
                            <Button>
                                Add to cart
                            </Button>
                            <Button onClick={swapUnits}>
                                Switch units 
                            </Button>
                        </Flex>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Has Enough</Th>
                                        <Th>Name</Th>
                                        <Th isNumeric>Quantity</Th>
                                        <Th>Unit</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {recipeIngredients && 
                                        recipeIngredients[units].map((ingredient, index) => (
                                            <Tr>
                                                <Td>
                                                    <Checkbox
                                                        colorScheme={colors[hasEnoughIngredient(ingredient)]}
                                                        size="lg"
                                                        defaultChecked={hasEnoughIngredient(ingredient) !== "Does not have the ingredient"}
                                                        key={index}
                                                    >  
                                                    </Checkbox>
                                                </Td>
                                                <Td>
                                                    {ingredient.name}
                                                </Td>
                                                <Td>
                                                    {Math.round(100 * servings * ingredient.amount) / 100}
                                                </Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton as={Button} colorScheme={'green'} rightIcon={<ChevronDownIcon />}>
                                                            {ingredient.unit}
                                                        </MenuButton>
                                                        <MenuList>
                                                            {conversionsTo(ingredient.unit).map((unit)=>{
                                                                return <MenuItem>{unit}</MenuItem>
                                                            })}
                                                        </MenuList>
                                                    </Menu>
                                                    
                                                </Td>
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                    {/* <Box mt="2rem" w="100%">
                        <Text fontSize="2xl">Nutritional facts (per serving)</Text>
                        <SimpleGrid columns={3} spacing={10} m="1rem">
                            <Flex direction="column" justifyContent="center" alignItems="center">
                                <Text as="b" fontSize='xl'>Cals</Text>
                                <Text as="span">100</Text>
                            </Flex>
                            <Flex direction="column" justifyContent="center" alignItems="center">
                                <Text as="b" fontSize='xl'>Proteins</Text>
                                <Text as="span">20g</Text>
                            </Flex>
                            <Flex direction="column" justifyContent="center" alignItems="center">
                                <Text as="b" fontSize='xl'>Fat</Text>
                                <Text as="span">3g</Text>
                            </Flex>
                            <Flex direction="column" justifyContent="center" alignItems="center">
                                <Text as="b" fontSize='xl'>Fiber</Text>
                                <Text as="span">6g</Text>
                            </Flex>
                            <Flex direction="column" justifyContent="center" alignItems="center">
                                <Text as="b" fontSize='xl'>Sugar</Text>
                                <Text as="span">4g</Text>
                            </Flex>
                            <Flex direction="column" justifyContent="center" alignItems="center">
                                <Text as="b" fontSize='xl'>Carbs</Text>
                                <Text as="span">3g</Text>
                            </Flex>
                        </SimpleGrid>
                    </Box> */}
                </Flex>
                <Box w={["100%", null, "50%"]} mt={["2rem", null, "0"]}>
                    <Text fontSize="2xl" mb={"2rem"}>Instructions</Text>
                    <Stack
                        spacing={4}
                        direction="column"
                        divider={<StackDivider borderColor="gray.200" />}
                    >
                        {
                            recipeData.steps &&
                            <RecipeSteps orientation="vertical" steps={recipeData.steps}>
                                <Button onClick={madeRecipe}>
                                    I made this recipe!
                                </Button>
                            </RecipeSteps>
                        }
                    </Stack>
                    <Reviews average={recipeData["average"]} reviewCount={recipeData["reviewCount"]}/>
                </Box>
            </Flex>
        </Center>
    );
};

export default RecipePage;
