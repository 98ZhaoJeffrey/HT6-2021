import React, { useState, useEffect, useContext, useRef} from "react";
import { 
    CircularProgress,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "@choc-ui/paginator";
import { useSearchParams } from "react-router-dom";
import FoodResult from "../components/FoodResult";
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import {Recipe, Ingredients} from "../ts/interfaces";
import {Unit} from "../ts/types"
import {firebase, firestore} from "../firebase";
import {AuthContext} from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";

const Loading = () => {
    return (
        <Flex gap="1rem" direction="column" alignItems="center" mt="4rem">
            <Text fontSize="2xl">Finding you the freshest recipes!</Text>
            <CircularProgress isIndeterminate color='green.300' size="xs" thickness="4px"/>
        </Flex>
    )
}

const Search = () => {
    const user = useContext(AuthContext);
    const [ingredients, setIngredients] = useIngredientsListContext()[0];
    const [currentList, setCurrentList] = useIngredientsListContext()[1];
    const [ingredientLists, setIngredientLists] = useState<{ [key: string]: Ingredients[]} >({});

    const [loading, setLoading] = useState(true);

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [numResults, setNumResults] = useState(10);
    const [order, setOrder] = useState<string>("Matched ingredients");
    const [searchParams, setSearchParams] = useSearchParams();
    const ref = doc(firestore, "users", user!.uid);

    const searchRef = useRef<HTMLInputElement>(null);

    const parseNumber = (input: string | null) => {
        if(input === null){
            return 1;
        }
        return parseInt(input);
    }

    const parseString = (input: string | null) => {
        if(input === null){
            return "";
        }
        return input;
    }

    // when user first access page, send request
    // only make new request when user changes ingredients list
    useEffect(()=>{
        const getData = async () => {
            setLoading(true);
            try{
                const body = JSON.stringify({
                    "order": order,
                    "ingredients": ingredients
                });
        
                const options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: body,
                };
                const response = await fetch(`https://us-central1-foodaddtech.cloudfunctions.net/findRecipes?page=${parseNumber(searchParams.get("page"))}
                &search=${parseString(searchParams.get("search"))}`, options);
                const result = (await response.json())["response"];
                console.log(result)
    
                const recipes: Recipe[] = result["data"].map((data: { [x: string]: any; }) =>{
                    const recipe = data["recipe"]
                    return{
                        "id": data["id"],
                        "name": recipe["name"],
                        "description": recipe["description"],
                        "image": recipe["image"],
                        "steps": recipe["steps"],
                        "time": recipe["time"],
                        "ingredients": recipe["ingredients"].map((ingredient: { [x: string]: string; }) =>{
                            return{
                                "name": ingredient["name"],
                                "amount": ingredient["amount"],
                                "unit": ingredient["unit"] as Unit
                            }
                        }),
                        "similarity": Math.round(100 * recipe["similarity"]),
                        "average": recipe["average"],
                        "reviewCount": recipe["reviewCount"]
                    }
                })
                setRecipes(recipes)
                setNumResults(result["num-results"])
                setLoading(false);                
            }catch (error){
                console.log(error)
            }
        }
        setTimeout(() => getData(), 1000);
        console.log(ingredients);
        
    }, [ingredients, order, searchParams]);

    useEffect(() => {
        getDoc(ref).then((doc) => {
            if (doc.exists()) {       
                setIngredientLists(doc.data().lists);
            }
            console.log(currentList)     
        });
    }, []);

    useEffect(() => {
        setIngredients(ingredientLists[currentList])
        setLoading(false);
        console.log("change ingredients")
    }, [currentList, ingredientLists])



    return (
        <Flex direction="column" alignItems={'center'} bg={useColorModeValue("brand.light", "brand.dark")} h="92vh">
            <InputGroup size="lg" width="80%" my="2rem">
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
            <Flex width="80%" direction="row" gap='2'>
                <Select onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                    setOrder(e.target.value)
                    setLoading(false);
                }}>
                    <option selected value="Matched Ingredients">Matched ingredients </option>
                    <option value="Alphabetical Order">Alphabetical order</option>
                    <option value="Top Rated">Top rated</option>
                    <option value="Cooking Time">Cooking time</option>
                </Select>
                <Select
                    value={currentList}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrentList(e.target.value)}
                >
                    {Object.keys(ingredientLists).map((listName)=>{
                        return <option value={listName}>{listName}</option>
                    })}
                </Select>
            </Flex>
            {currentList === "" ? 
                <Text>Please select a list before continuing</Text> : 
                loading ? <Loading /> : 
                recipes.length !== 0 ? recipes.map((recipe: Recipe) => {return(<FoodResult {...recipe}/>)}) : 
                <Text> We couldn't find anything, try adding ingredients or changing your query</Text>
            }
            {recipes?.length !== 0 &&
                <Flex
                    w="full"
                    p={50}
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
