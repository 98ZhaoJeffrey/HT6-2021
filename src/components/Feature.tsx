import React from "react";
import {
    chakra,
    Box,
    Flex,
    useColorModeValue,
    Icon,
} from "@chakra-ui/react";

interface Props{
    color: string,
    title: string
    icon: React.ElementType,
    children: React.ReactNode
}

const Feature = (props:Props) => {
    return (
        <Box p={4}>
            <Flex
                alignItems="center"
                justifyContent="center"
                w={8}
                h={8}
                mb={4}
                rounded="full"
                color={useColorModeValue(
                    `${props.color}.600`,
                    `${props.color}.100`
                )}
                bg={useColorModeValue(
                    `${props.color}.100`,
                    `${props.color}.600`
                )}
            >
                <Icon
                    boxSize={{base: 15, xl: 5}}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    as={props.icon}
                />
            </Flex>
            <chakra.h3
                mb={2}
                fontWeight="semibold"
                lineHeight="shorter"
                color={useColorModeValue("gray.900", "white.700")}
            >
                {props.title}
            </chakra.h3>
            <chakra.p
                fontSize={{base: "lg", xl: "md"}}
                color={useColorModeValue("gray.500", "gray.400")}
            >
                {props.children}
            </chakra.p>
        </Box>
    );
};


export default Feature