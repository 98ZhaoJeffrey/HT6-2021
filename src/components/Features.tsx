import React from "react";
import {
    chakra,
    Box,
    useColorModeValue,
    Flex,
} from "@chakra-ui/react";
import Feature from './Feature'

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
            <Flex
                alignItems="center"
                justifyContent="space-around"
                direction={{base: "column", xl: "row"}}
                mt={6}
            >
                <Feature
                    color="red"
                    title="Login"
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                            />
                        </svg>
                    }
                >
                    Login to track the ingredients in your fridge!
                </Feature>

                <Feature
                    color="green"
                    title="Search"
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    }
                >
                    Search for recipes with common ingredients!
                </Feature>

                <Feature
                    color="blue"
                    title="Menu"
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    }
                >
                    Delicious menu with instructions to create!
                </Feature>
            </Flex>
        </Box>
    );
}

export default Features;
