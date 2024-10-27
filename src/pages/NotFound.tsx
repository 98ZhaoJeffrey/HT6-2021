import React from 'react';
import { Flex, Text, Image, useColorModeValue } from '@chakra-ui/react';
import frowny_face from "../assets/frowny_face.png"

const NotFound = () => {
    return (
        <Flex flexDirection="column" bg={useColorModeValue("brand.light", "brand.dark")} h="92vh" alignItems="center" justifyContent="center">
            <Image 
                src={frowny_face}
                alt="Picture of an frowny face emoji"
                width="150px" height="150px"
            />
            <Text fontWeight="600" fontSize="4xl" mt="2rem">We've looked long and far but we couldn't find this page...</Text>
        </Flex>
    )

}

export default NotFound;