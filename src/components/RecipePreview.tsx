import React from "react";
import { DeleteIcon } from "@chakra-ui/icons"
import { AspectRatio, Box, chakra, Flex, IconButton, Image } from "@chakra-ui/react"
import {Link} from "react-router-dom";


interface Props {
    image: string,
    name: string,
    id: string,
    remove: () => void
}

const RecipePreview = (props: Props) => {

    const ChakraLink = chakra(Link);

    return(
        <Box>
            <AspectRatio maxW='lg' ratio={4 / 3}>
                <Image 
                    src={props.image} 
                    alt={props.name} 
                    borderRadius="5%"                       
                    alignSelf="center"
                    objectFit="cover"
                    boxSize='xg'
                />
            </AspectRatio>
            <Flex mt="1rem" flexDirection="row" gap="1" justifyContent="space-between">
                <ChakraLink to={`/recipe/${props.id}`} fontWeight="600">{props.name}</ChakraLink >
                <IconButton 
                    colorScheme="red" 
                    variant="outline" 
                    icon={<DeleteIcon/>}
                    aria-label="Remove"
                    onClick={props.remove}
                />
            </Flex>
        </Box>
    )
}

export default RecipePreview;
