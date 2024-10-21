import React, { FC, useState } from 'react';
import { Stack, NumberInput, Box, Text, NumberInputField } from '@chakra-ui/react';

interface TimeInputProps {
    handleChange: (name: string, value: number) => void;
}

const TimeInput: FC<TimeInputProps> = ({ handleChange }) => {
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

  const handleTimeChange = (name: string, value: number) => {
    setDuration((prev) => ({ ...prev, [name]: value }));
    handleChange(name, value)
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
        <Stack direction="row">
          <Box>
            <Text>Hours</Text>
            <NumberInput
                name="hours"
                value={duration.hours}
                onChange={(value) => handleTimeChange("hours", parseInt(value))}
                placeholder="Hours"
                min={0}
            >
                <NumberInputField />
            </NumberInput>
          </Box>
          <Box>
            <Text>Minutes</Text>
            <NumberInput
                name="minutes"
                value={duration.minutes}
                onChange={(value) => handleTimeChange("minutes", parseInt(value))}
                placeholder="Minutes"
                min={0}
                max={59}
            >
                <NumberInputField />
            </NumberInput>
          </Box>
        </Stack>
    </Box>
  );
};

export default TimeInput;
