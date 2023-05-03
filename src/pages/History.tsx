import React, { useState, useEffect, useContext } from "react";
import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { Page } from "../ts/interfaces";
import {firebase, firestore} from "../firebase";
import { AuthContext } from "../contexts/AuthContext";
import RecipePreview from "../components/RecipePreview";
import { doc, getDoc, setDoc, addDoc } from "firebase/firestore";

const History = () => {
    const user = useContext(AuthContext);
    const [history, setHistory] = useState<Page[]>([]);
    const ref = doc(firestore, "users", user!.uid);


    useEffect(() => {
        getDoc(ref).then((doc) => {
            if(doc.exists()){
                setHistory(doc.data().history);
            }
            else{
                setDoc(ref, {favorites: [], history: [], lists: {"My first list" : []}});
            }  
        })
    }, [])

    useEffect(() => console.log(history), [history])

    const deleteItem = (id: string) => {
        getDoc(ref).then((doc) => {
            if(doc.exists()){
                setDoc(ref, {...doc.data(), history: history.filter((item: Page) => item.id !== id)});
                setHistory(history.filter((item: Page) => item.id !== id));
            }
            else{
                setDoc(ref, {favorites: [], history: [], lists: {"My first list" : []}});
            }  
        })   
    }

    return(
        <Box display="flex" flexDirection="column" bg={useColorModeValue("brand.light", "brand.dark")} h="92vh" alignItems="center">
            <Text fontWeight="600" fontSize="4xl" mt="2rem">Recent History</Text>
            {history?.length === 0 ? <Text fontWeight="600">There is nothing here</Text>
                : <SimpleGrid columns={4} spacing={10} p="2rem">
                    {history.map((item: Page) => { 
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

export default History;