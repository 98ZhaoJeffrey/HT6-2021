import React, { useState, useEffect, useContext } from "react";
import {
    chakra,
    Box,
    Flex,
    Text,
    useColorModeValue,
    Heading,
    Image
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import {AuthContext} from "../contexts/AuthContext";
import {Ingredients} from "../ts/interfaces";

//should change this to use types as well but we will see when we use the api

interface Props{
    name: string,
    image: string,
    description: string,
    id: string,
    steps: string[],
    time: number,
    ingredients: Ingredients[],
    similarity? : number
}

const FoodResult = (props: Props) => {
    const user = useContext(AuthContext);
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [recipeIngredients, setRecipeIngredients] = useState<Ingredients[]>([]);
    const ref = firebase.firestore();
    //const ref = firebase.firestore().collection("users").doc(user!.uid);
    useEffect(() => {
        if (user) {
            ref.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc: any) {
                    if (doc.exists) {
                        console.log(doc.data().lists)
                        //setIngredients(doc.data().listingredients);
                    } else {
                        console.log("failed")
                    }
                });
        }
        ref.collection("recipes")
            .doc(props.id)
            .get()
            .then(function (doc: any) {
            });
    }, []);

    return (
        <Flex
            bg={useColorModeValue("white", "gray.600")}
            p={50}
            w="full"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                bg={useColorModeValue("white", "gray.800")}
                mx={{ lg: 8 }}
                display={{ lg: "flex" }}
                maxW={{ lg: "5xl" }}
                shadow={{ lg: "lg" }}
                rounded={{ lg: "lg" }}
            >
                <Box w={{ lg: "50%" }}>
                    <Image
                        rounded={{ lg: "lg" }}
                        loading="lazy"
                        src={props.image}
                        alt={props.name}
                        boxSize='md'
                    />
                </Box>
                <Box
                    py={12}
                    px={6}
                    maxW={{ base: "xl", lg: "5xl" }}
                    w={{ lg: "50%" }}
                >
                    <chakra.h2
                        fontSize={{ base: "2xl", md: "3xl" }}
                        color={useColorModeValue("gray.800", "white")}
                        fontWeight="bold"
                    >
                        <Link to={`/recipe/${props.id}`}>{props.name}</Link>
                    </chakra.h2>
                    <Text
                        mt={4}
                        color={useColorModeValue("gray.600", "gray.400")}
                        noOfLines={4}
                    >
                        {props.description}
                    </Text>
                    <Text
                        mt={4}
                        color={useColorModeValue("gray.600", "gray.400")}
                    >
                        Cook time: {props.time} mins
                    </Text>
                    <Box mt={8}>
                        <Heading size="md@">
                            {props.similarity}%
                            Match
                        </Heading>
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default FoodResult;
