import React, { useState, useEffect, useContext } from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { Page } from "../ts/interfaces";
import firebase from "firebase";
import { AuthContext } from "../contexts/AuthContext";
import RecipePreview from "../components/RecipePreview";

const Collection = () => {
    const user = useContext(AuthContext);
    const [favorites, setFavorites] = useState<Page[]>([]);
    const ref = firebase.firestore().collection("users").doc(user!.uid);

    useEffect(() => {
        ref.get().then((doc: firebase.firestore.DocumentData) => {
            if(doc.exists){
                setFavorites(doc.data().favorites);
            }
            else{
                ref.set({favorites: [], history: [], lists: {"My first list" : []}});
            }  
        })
    }, [])

    useEffect(() => console.log(favorites), [favorites])

    const deleteItem = (id: string) => {
        ref.get().then((doc: firebase.firestore.DocumentData) => {
            if(doc.exists){
                ref.set({...doc.data(), favorite: favorites.filter((item: Page) => item.id !== id)});
                setFavorites(favorites.filter((item: Page) => item.id !== id));
            }
            else{
                ref.set({history: [], favorites: [], lists: {"My first list" : []}});
            }  
        })   
    }

    return(
        <Box>
            <Text fontWeight="600">Your favorite recipes</Text>
            {favorites?.length === 0 ? <Text fontWeight="600">There is nothing here</Text>
                : <SimpleGrid columns={4} spacing={10} p="2rem">
                    {favorites.map((item: Page) => { 
                        return(
                            <RecipePreview 
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