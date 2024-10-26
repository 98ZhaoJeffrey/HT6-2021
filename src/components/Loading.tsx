import React from 'react';
import { Text, Flex, CircularProgress } from '@chakra-ui/react';

interface LoadingProps {
  message: string;
}

export const Loading: React.FC<LoadingProps> = ({ message }) => {

  return (
    <Flex gap="1rem" direction="column" alignItems="center" mt="4rem">
      <Text fontSize="2xl" textAlign="center">
        {message}
      </Text>
      <CircularProgress 
        isIndeterminate
        color="green.300" 
        size="120px"
        thickness="4px"
      />
    </Flex>
  );
};
