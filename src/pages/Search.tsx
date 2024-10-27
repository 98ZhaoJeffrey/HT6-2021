import React, { useState, useEffect, useContext, useRef, lazy} from "react";
import { 
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "@choc-ui/paginator";
import { useSearchParams } from "react-router-dom";
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import {Recipe, Ingredients} from "../ts/interfaces";
import {firebase, firestore} from "../firebase";
import FoodResult from "../components/FoodResult";
import {AuthContext} from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { parseNumber } from "../utils/parseValues";
import { findRecipes } from "../utils/findRecipes";
import { Loading } from "../components/Loading";



const RenderRecipeContent = ({ currentList, recipes, isLoading }: { currentList: string; recipes: Recipe[], isLoading: boolean}) => {
    const renderContent = () => {
        if (currentList === "") {
            return <Text>Please select a list before continuing</Text>;
        }
        if(isLoading) {
            return <Loading message="Finding you the freshest recipes!" />
        }
        return renderRecipes();
    };
  
    const renderRecipes = () => (
      <Flex flex="1" overflowY="auto" w="100%" p={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {recipes.map((recipe: Recipe) => (
            <Flex key={recipe.id} align="center" justify="center" w="full">
              <FoodResult {...recipe} />
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    );
  
    return <>
        {renderContent()}
    </>;
  }

const Search = () => {
    const user = useContext(AuthContext);
    const [ingredients, setIngredients] = useIngredientsListContext()[0];
    const [currentList, setCurrentList] = useIngredientsListContext()[1];
    const [ingredientLists, setIngredientLists] = useState<{ [key: string]: Ingredients[]} >({});

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [numResults, setNumResults] = useState(0);
    const [order, setOrder] = useState<string>("Matched ingredients");
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const searchRef = useRef<HTMLInputElement>(null);

    // when user first access page, send request
    // only make new request when user changes ingredients list
    useEffect(()=>{
        const getData = async () => {
            try {
                setIsLoading(true)
                const results = await findRecipes(order, ingredients, searchParams); 
                setRecipes(results.recipes)
                setNumResults(results["numberResults"])
                setIsLoading(false)
            } catch (error){
                console.log(error)
            }
        }
        const timeoutId = setTimeout(() => getData(), 2000);
        
        return () => clearTimeout(timeoutId);
    }, [ingredients, order, searchParams]);

    useEffect(() => {
        const ref = doc(firestore, "users", user!.uid);
        getDoc(ref).then((doc) => {
            if (doc.exists()) {       
                setIngredientLists(doc.data().lists);
            }  
        });
    }, []);

    useEffect(() => {
        setIngredients(ingredientLists[currentList])
    }, [currentList, ingredientLists])

    return (
        <Flex direction="column" alignItems="center" justify="space-between" bg={useColorModeValue("brand.light", "brand.dark")} minH="92vh" h="auto" py="2rem">
            <Stack width="80%" spacing="4">
                <InputGroup size="lg" >
                    <Input placeholder="Search" ref={searchRef}/>
                    <InputRightElement
                        _hover={{"cursor": "pointer"}}
                        children={<IconButton color='green.500' variant="ghost" icon={<SearchIcon />} aria-label="Search" />}
                        onClick={() => {
                            if(searchRef && searchRef.current){
                                setSearchParams({"search": searchRef.current.value}); 
                            }
                        }}
                    />                    
                </InputGroup>
                <Flex direction="row" gap='2' mb="10">
                    <Select
                        defaultValue={"Alphabetical Order"} 
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                            setOrder(e.target.value)
                        }}
                    >
                        <option value="Matched Ingredients">Matched ingredients </option>
                        <option value="Alphabetical Order">Alphabetical order</option>
                        <option value="Top Rated">Top rated</option>
                        <option value="Cooking Time">Cooking time</option>
                    </Select>
                    <Select
                        placeholder="Select a list"
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrentList(e.target.value)}
                    >
                        {Object.keys(ingredientLists).map((listName)=>{
                            return <option value={listName} key={listName}>{listName}</option>
                        })}
                    </Select>
                </Flex>
            </Stack>
            { RenderRecipeContent({currentList, recipes, isLoading}) }     
            {recipes?.length !== 0 &&
                <Flex
                    w="full"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Pagination
                        current={parseNumber(searchParams.get("page"))}
                        onChange={(newPage)=>{
                            if(newPage != null){
                                setSearchParams({"page": newPage.toString()});
                            }
                        }}
                        total={numResults}
                        paginationProps={{ display: "flex" }}
                        pageSize={5}
                        pageNeighbours={2}
                        size={"md"}
                        baseStyles={{ bg: "green.300" }}
                        activeStyles={{ bg: "green.600" }}
                        hoverStyles={{ bg: "green.100" }}
                    />
                </Flex>
            }
        </Flex>
    );
};

export default Search;
