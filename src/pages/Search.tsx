import React, { useState, useEffect, useMemo} from "react";
import { 
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "../components/Pagination";
import FoodResult from "../components/FoodResult";
import { useIngredientsListContext } from "../contexts/IngredientsListContext";
import {Recipe} from "../ts/interfaces";
import ExampleRecipe from "./ExampleRecipe.json"


const Search = () => {
    const [ingredients, setIngredients] = useIngredientsListContext()[0];

    //we will fetch this from spoonacular for now, then use our own database eventually
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    
    // when user first access page, send request
    // only make new request when user changes ingredients list

    useEffect(()=>{
        const getData = async () => {
            try{
                // should be a fetch request but we will change this
                const data = ExampleRecipe
                console.log(data)
            //setRecipes([...data])
            }catch{
                console.log("error")
            }
        }
        getData();
    }, []);

    return (
        <Flex direction="column" alignItems={'center'} >
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
            <Select placeholder="Sort By" width="80%"></Select>
            <Pagination />
        </Flex>
    );
};

export default Search;
