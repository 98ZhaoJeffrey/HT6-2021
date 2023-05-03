import React from "react";
import { chakra, Flex, useColorModeValue, Icon } from "@chakra-ui/react";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Props{
    disabled: number,
    active: boolean,
    children: React.ReactNode
}

const Pagination = () => {
    const PagButton = (props:Props) => {
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
                {...(props.active && activeStyle)}
            >
                {props.children}
            </chakra.button>
        );
    };
    return (
        <Flex
        bg={useColorModeValue("#F9FAFB", "gray.600")}
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
      >
        <Flex>
          <PagButton disabled={0} active={false}>
            <Icon
              as={IoIosArrowBack}
              color={useColorModeValue("gray.700", "gray.200")}
              boxSize={4}
            />
          </PagButton>
          <PagButton disabled={0} active={false}>1</PagButton>
          <PagButton disabled={0} active={false}>5</PagButton>
          <PagButton disabled={0} active={false}>6</PagButton>
          <PagButton active disabled={0}>7</PagButton>
          <PagButton disabled={0} active={false}>8</PagButton>
          <PagButton disabled={0} active={false}>9</PagButton>
          <PagButton disabled={0} active={false}>50</PagButton>
          <PagButton disabled={0} active={false} >
            <Icon
              as={IoIosArrowForward}
              color={useColorModeValue("gray.700", "gray.200")}
              boxSize={4}
            />
          </PagButton>
        </Flex>
      </Flex>
    );
};

export default Pagination;
