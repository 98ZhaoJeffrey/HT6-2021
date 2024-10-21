import React, { FC } from 'react';
import { Text, Stack, Button, Heading, HStack, Textarea, Flex } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

interface StepsFormProps {
  formData: { steps: string[] };
  handleChange: (name: string, value: any) => void;
}

const StepsForm: FC<StepsFormProps> = ({ formData, handleChange }) => {
  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    handleChange('steps', updatedSteps);
  };

  const addStep = () => handleChange('steps', [...formData.steps, '']);

  const removeStep = (index: number) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    handleChange('steps', updatedSteps);
  };

  return (
    <Stack spacing={4} w={"100%"}>
      <Heading size="md">Step 2: Add Steps</Heading>
      {formData.steps.map((step, index) => (
        <HStack key={index} spacing={2}>
          <Flex direction={"column"} width="90%">
            <Text>{`Step ${index + 1}`}</Text>
            <Textarea
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              resize="vertical"
              size="sm"
            />
          </Flex>
          <Button colorScheme={'red'} onClick={() => removeStep(index)} rightIcon={<DeleteIcon/>}>Delete</Button>
        </HStack>
      ))}
      <Button onClick={addStep} disabled={formData.steps.filter((step) => step === '').length > 0}>
        Add another step
      </Button>
    </Stack>
  );
};

export default StepsForm;
