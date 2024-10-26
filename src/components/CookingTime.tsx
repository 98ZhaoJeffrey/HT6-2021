import React from 'react'
import { Text, Box, Icon, HStack, useColorModeValue } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa"; // Clock icon
import { formatTimeString } from '../utils/formatTime';

function CookingTime({ time }: { time: number }) {
  return (
    <Box p={2} bg={useColorModeValue("brand.light", "gray.600")} borderRadius="md" shadow="md" maxW="sm">
      <HStack spacing={2}>
        <Icon as={FaClock} color={useColorModeValue("blue.400", "blue.100")} />
        <Text fontWeight="bold" fontSize="md" color={useColorModeValue("gray.700", "gray.100")}>
          Total Cooking Time:
        </Text>
        <Text fontSize="md" color={useColorModeValue("blue.400", "blue.100")}>
          {formatTimeString(time)}
        </Text>
      </HStack>
    </Box>
  );
}

export default CookingTime;
