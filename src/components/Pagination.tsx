import React from "react";
import { chakra, Flex, useColorModeValue, Icon, HStack, Input, Text } from "@chakra-ui/react";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Props{
    disabled: number,
    active: boolean,
    children: React.ReactNode
}

const Pagination = () => {
    const PagButton = (Props:Props) => {
        const activeStyle = {
            bg: useColorModeValue("brand.600", "brand.500"),
            color: useColorModeValue("white", "gray.200"),
        };
        return (
            <chakra.button
                mx={1}
                px={4}
                py={2}
                rounded="md"
                bg={useColorModeValue("green.400", "green.700")}
                color={useColorModeValue("white.400", "gray.200")}
                opacity={0.6}
                {...(Props.active && activeStyle)}
            >
                {Props.children}
            </chakra.button>
        );
    };
    return (
        <Flex
            bg={useColorModeValue("white", "gray.600")}
            p={50}
            w="full"
            alignItems="center"
            justifyContent="center"
        >
            <HStack>
                <PagButton disabled={0} active={false} >
                    <Icon
                        as={IoIosArrowBack}
                        color={useColorModeValue("gray.700", "gray.200")}
                        boxSize={4}
                    />
                </PagButton>
                <PagButton disabled={0} active={false} >1</PagButton>
                <PagButton disabled={0} active={false} >2</PagButton>
                <PagButton disabled={0} active={false} >3</PagButton>
                <PagButton disabled={0} active={false} >4</PagButton>
                <PagButton disabled={0} active={false} >5</PagButton>
                <PagButton disabled={0} active={false}>
                    <Icon
                    as={IoIosArrowForward}
                    color={useColorModeValue("gray.700", "gray.200")}
                    boxSize={4}
                    />
                </PagButton>
                <HStack>
                    <Text wordBreak={"unset"}>Go to:</Text>
                    <Input w="50px" />
                </HStack>
            </HStack>
        </Flex>
    );
};

export default Pagination;
