import React, { useState, useEffect, useMemo} from "react";
import { 
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Switch
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "@choc-ui/paginator";
import { useSearchParams } from "react-router-dom";
import FoodResult from "../components/FoodResult";
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import {Recipe, Ingredients} from "../ts/interfaces";
import {Unit} from "../ts/types"
import ExampleRecipe from "./ExampleRecipe.json"
import { AiOutlineConsoleSql } from "react-icons/ai";
import RecipePage from "./Recipe";

const Search = () => {
    const [ingredients, setIngredients] = useIngredientsListContext()[0];

    //we will fetch this from spoonacular for now, then use our own database eventually
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [order, setOrder] = useState<string>("Matched ingriedents (Descending)");
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState<number>(1);

    
    // when user first access page, send request
    // only make new request when user changes ingredients list

    useEffect(()=>{
        const getData = async () => {
            try{
                // should be a fetch request but we will change this
                const data = ExampleRecipe

                const recipes: Recipe[] = data.map((recipe) =>{
                    return{
                        "id": recipe["id"],
                        "name": recipe["name"],
                        "description": recipe["description"],
                        "image": recipe["image"],
                        "steps": recipe["steps"],
                        "time": recipe["time"],
                        "ingredients": recipe["ingredients"].map((ingredient) =>{
                            return{
                                "name": ingredient["name"],
                                "amount": ingredient["amount"],
                                "unit": ingredient["unit"] as Unit
                            }
                        })
                    }
                })
                console.table(recipes)
                setRecipes(recipes)
            }catch{
                const num = Number(searchParams.get('page'));
                if(Number.isInteger(num) && num > 0){
                    setPage(num);
                }
                console.log("error")
            }
        }
        getData();
    }, []);

    const sortby = (input: string): (a: Recipe, b: Recipe) => number =>{
        switch(input){
            case "Matched ingriedents (Ascending)": 
                return (a: Recipe, b: Recipe) => {return a.name.toLowerCase().localeCompare(b.name.toLowerCase())}
            case "Alphabetical order":
                return (a: Recipe, b: Recipe) => {return a.name.toLowerCase().localeCompare(b.name.toLowerCase())};
            case "Top Rated":
                return (a: Recipe, b: Recipe) => {return 1};
            case "Cooking time":
                return (a: Recipe, b: Recipe) => {return a.time < b.time ? 1 : -1}
            default:
                return (a: Recipe, b: Recipe) => {return 1}
        }
    }

    useEffect(()=>{
        recipes.sort(sortby(order))
        console.table(recipes)
    }, [order, recipes]);


    return (
        <Flex direction="column" alignItems={'center'} bg={"gray.50"}>
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
            <Flex direction="row" alignItems={'center'} width="80%">
                <Select width="80%" onChange={(e) => {setOrder(e.target.value)}}>
                    <option selected value="Matched ingriedents (Descending)">Matched ingriedents (Descending)</option>
                    <option value="Matched ingriedents (Ascending)">Matched ingriedents (Ascending)</option>
                    <option value="Alphabetical order">Alphabetical order</option>
                    <option value="Top Rated">Top rated</option>
                    <option value="Cooking time">Cooking time</option>
                </Select>
                Recommend recipes with current ingriedents?
                <Switch id='search-all' size='lg'/>
            </Flex>
            {recipes.map((recipe: Recipe) => {
                return(
                    <FoodResult {...recipe}/>
                )
            })}
            {recipes !== [] ?
            <Flex
                w="full"
                bg={"gray.50"}
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
                    total={500}
                    paginationProps={{ display: "flex" }}
                    pageNeighbours={2}
                    size={"md"}
                    baseStyles={{ bg: "green.300" }}
                    activeStyles={{ bg: "green.700" }}
                    hoverStyles={{ bg: "green.100" }}
                />
            </Flex> : null }
        </Flex>
    );
};

export default Search;
