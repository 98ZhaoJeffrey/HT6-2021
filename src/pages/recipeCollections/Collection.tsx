import React, { useState, useEffect, useContext } from "react";
import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { Page } from "../../ts/interfaces";
import {firestore} from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../contexts/AuthContext";
import RecipePreview from "../../components/RecipePreview";

interface DataCollectionProps {
    field: string
}

const Collection = (props: DataCollectionProps) => {

    const { field } = props;
    const user = useContext(AuthContext);
    const [data, setData] = useState<Page[]>([]);
    const ref = doc(firestore, "users", user!.uid);

    useEffect(() => {
        getDoc(ref).then((doc) => {
            if(doc.exists()){
                setData(doc.data()[field]);
            } 
        })
    }, [])

    const deleteItem = (id: string) => {
        getDoc(ref).then((doc) => {
            if(doc.exists()){
                setDoc(ref, {...doc.data(), [field]: data.filter((item: Page) => item.id !== id)});
                setData(data.filter((item: Page) => item.id !== id));
            }  
        })   
    }

    return(
        <Box display="flex" flexDirection="column" bg={useColorModeValue("brand.light", "brand.dark")} h="92vh" alignItems="center">
            <Text fontWeight="600" fontSize="4xl" mt="2rem">Your favorite recipes</Text>
            {data?.length === 0 ? <Text fontWeight="600">There is nothing here</Text>
                : <SimpleGrid columns={4} spacing={10} p="2rem">
                    {data.map((item: Page, index: number) => { 
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