import React, { useState, useEffect, useContext } from "react";
import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { Page } from "../ts/interfaces";
import {firebase, firestore} from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import RecipePreview from "../components/RecipePreview";

const Collection = () => {
    const user = useContext(AuthContext);
    const [favorites, setFavorites] = useState<Page[]>([]);
    const ref = doc(firestore, "users", user!.uid);

    useEffect(() => {
        getDoc(ref).then((doc) => {
            if(doc.exists()){
                setFavorites(doc.data().favorites);
            }
            else{
                setDoc(ref, {favorites: [], history: [], lists: {"My first list" : []}});
            }  
        })
    }, [])

    useEffect(() => console.log(favorites), [favorites])

    const deleteItem = (id: string) => {
        getDoc(ref).then((doc) => {
            if(doc.exists()){
                setDoc(ref, {...doc.data(), favorite: favorites.filter((item: Page) => item.id !== id)});
                setFavorites(favorites.filter((item: Page) => item.id !== id));
            }
            else{
                setDoc(ref, {history: [], favorites: [], lists: {"My first list" : []}});
            }  
        })   
    }

    return(
        <Box display="flex" flexDirection="column" bg={useColorModeValue("brand.light", "brand.dark")} h="92vh" alignItems="center">
            <Text fontWeight="600" fontSize="4xl" mt="2rem">Your favorite recipes</Text>
            {favorites?.length === 0 ? <Text fontWeight="600">There is nothing here</Text>
                : <SimpleGrid columns={4} spacing={10} p="2rem">
                    {favorites.map((item: Page, index: number) => { 
                        return(
                            <RecipePreview 
                                key={index} 
                                {...item}
                                remove={() => deleteItem(item.id)}
                            />
                        )
                    })}
                </SimpleGrid>
            }
        </Box>
    )
}

export default Collection;