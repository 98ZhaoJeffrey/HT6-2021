import React, { useState } from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import UploadRecipeForm from '../components/UploadRecipeForm';

const Upload = () => {
    return <Box display="flex" flexDirection="column" bg={useColorModeValue("brand.light", "brand.dark")} h="92vh" alignItems="center">
         <Text fontWeight="600" fontSize="4xl" mt="2rem">Upload your recipe for others to see</Text>
         <UploadRecipeForm />
    </Box>
}

export default Upload