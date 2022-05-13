import { Heading, Flex, Text, Image, Box, useColorModeValue} from "@chakra-ui/react";
import React from "react";
import logo from "../assets/logo.png";
import dottech from "../assets/dottech.png";
import foodbackground from "../assets/foodbackground.png"


const Hero = () => {
    return (
        <Box>
            <Flex
            w={'full'}
            h={'75vh'}
            
            backgroundImage={foodbackground}
            backgroundSize={'cover'}
            backgroundPosition={'center center'}>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%">
                    <Image src={logo} width="100px" height="100px"></Image>
                    <Heading size="4xl" color="#262626" ml="20px">
                        FoodAdd
                    </Heading>
                    <Image src={dottech} height="54px"></Image>
                </Box>
            </Flex>

            <Flex
                direction="column"
                align="center"
                bg={useColorModeValue("brand.light", "brand.dark")}
            >
                <Text as="span" fontSize="22px" color={useColorModeValue("brand.dark", "brand.light")} padding="50px">
                    <Text as="span" fontWeight="bold" color={useColorModeValue("gray.700", "gray.400")}>
                        Manage
                    </Text>{" "}
                    your ingredients and get {" "}
                    <Text as="span" fontWeight="bold" color={useColorModeValue("gray.700", "gray.400")}>
                        recommended
                    </Text>{" "}
                    recipes!
                </Text>
            </Flex>
        </Box>
    );
};

export default Hero;
