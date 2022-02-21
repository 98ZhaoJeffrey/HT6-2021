import { Heading, Flex, Text, Image, Box} from "@chakra-ui/react";
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
                maxW={{ xl: "1200px" }}
                m="0 auto"
                //{...props}
            >
                <Text as="span" fontSize="22px" color="grey" padding="50px">
                    Use this website to{" "}
                    <Text as="span" fontWeight="bold" color="black">
                        manage
                    </Text>{" "}
                    your ingredients and{" "}
                    <Text as="span" fontWeight="bold" color="black">
                        follow
                    </Text>{" "}
                    recipes!
                </Text>
            </Flex>
        </Box>
    );
};

export default Hero;
