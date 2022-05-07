import React, { useState, useEffect, useContext} from "react";
import { 
    CircularProgress,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Text
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "@choc-ui/paginator";
import { useSearchParams } from "react-router-dom";
import FoodResult from "../components/FoodResult";
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import {Recipe, Ingredients} from "../ts/interfaces";
import {Unit} from "../ts/types"
import firebase from "firebase";
import {AuthContext} from "../contexts/AuthContext";

const Search = () => {
    const user = useContext(AuthContext);
    const [ingredients, setIngredients] = useIngredientsListContext()[0];
    const [currentList, setCurrentList] = useIngredientsListContext()[1];
    const [ingredientLists, setIngredientLists] = useState<{ [key: string]: Ingredients[]} >({});

    const [loading, setLoading] = useState(true);

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [numResults, setNumResults] = useState(10);
    const [order, setOrder] = useState<string>("Matched ingredients");
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState<number>(1);    
    const ref = firebase.firestore().collection("users").doc(user!.uid);

    // when user first access page, send request
    // only make new request when user changes ingredients list
    useEffect(()=>{
        const getData = async () => {
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
                const response = await fetch(`https://us-central1-foodaddtech.cloudfunctions.net/findRecipes?page=${page}`, options);
                const result = (await response.json())["response"];
                console.log(result);

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
                        "similarity": Math.round(100 * recipe["similarity"])
                    }
                })
                setRecipes(recipes)
                setNumResults(result["num-results"])
                setLoading(false);
            }catch (error){
                const num = Number(searchParams.get('page'));
                if(Number.isInteger(num) && num > 0){
                    setPage(num);
                }
                console.log(error)
            }
        }
        getData();
        console.log(ingredients)
    }, [ingredients, order]);

    useEffect(() => {
        ref.get().then((doc: firebase.firestore.DocumentData) => {
            if (doc.exists) {       
                setIngredientLists(doc.data().lists);
            }
            else{
                firebase
                    .firestore()
                    .collection("users")
                    .doc(user!.uid)
                    .set({favorites: [], history: [], lists: {"My first list" : []}});
                console.log("Initialize user");
                setIngredientLists({"My first list" : []});
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
        <Flex direction="column" alignItems={'center'} bg={"white"}>
            <InputGroup size="lg" width="80%" my="2rem">
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='green.500' />}
                />
                <Input
                    placeholder="Search"
                >
                </Input>                
            </InputGroup>
            <Flex width="80%" direction="row" gap='2'>
                <Select onChange={(e) => {
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
                    onChange={(e) => setCurrentList(e.target.value)}
                >
                    {Object.keys(ingredientLists).map((listName)=>{
                        return <option value={listName}>{listName}</option>
                    })}
                </Select>
            </Flex>
            
            {currentList === "" ? 
                <Text> Please select a list before continuing</Text> : 
                loading ? <CircularProgress isIndeterminate color='green.300' /> : recipes.map((recipe: Recipe) => {return(<FoodResult {...recipe}/>)})
            }
            {recipes !== [] &&
                <Flex
                    w="full"
                    bg={"white"}
                    p={50}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Pagination
                        current={page}
                        onChange={(newPage)=>{
                            if(newPage != null){
                                setPage(newPage);
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
