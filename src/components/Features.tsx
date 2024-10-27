import React from "react";
import {
    chakra,
    Box,
    useColorModeValue,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";
import Feature from './Feature'
import { FEATURES } from "../constants/features";

const Features = () => {
    return (
        <Box
            px={8}
            py={20}
            mx="auto"
            bg={useColorModeValue("brand.light", "brand.dark")}
            shadow={useColorModeValue("xl", "none")}
        >
            <Box textAlign={{ lg: "center" }}>
                <chakra.p
                    mt={2}
                    fontSize={{ base: "3xl", sm: "4xl" }}
                    lineHeight="8"
                    fontWeight="extrabold"
                    letterSpacing="tight"
                    color={useColorModeValue("gray.900", "green.500")}
                >
                    Features
                </chakra.p>
                <chakra.p
                    mt={4}
                    maxW="2xl"
                    fontSize="xl"
                    lineHeight="9"
                    mx={{ lg: "auto" }}
                    color={useColorModeValue("gray.500", "gray.400")}
                >
                    Check out all that you can do with FoodAdd!
                </chakra.p>
            </Box>
            <SimpleGrid 
                columns={{ base: 1, md: 2, xl: 3 }} 
                spacing={6} 
                mt={6}
            >
                {
                    FEATURES.map((feature, index) => {
                        return (
                            <Feature 
                                key={index}
                                color={feature.color}
                                title={feature.title}
                                icon={feature.icon}
                            >
                                {feature.text}
                            </Feature>
                        )
                    })
                }
               

            </SimpleGrid>
        </Box>
    );
}

export default Features;
