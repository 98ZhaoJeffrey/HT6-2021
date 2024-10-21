import React, { FC, useState } from 'react';
// import Select from 'react-select';
import { Stack, Input, Button, Heading, Select, Box, ButtonGroup, InputGroup, InputRightAddon, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Th, Thead, Tr, NumberInput, NumberInputField } from '@chakra-ui/react';
import { Ingredients } from '../../ts/interfaces';
import units from '../../constants/units';
import { Unit } from '../../ts/types';
import { AddIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';

interface IngredientsFormProps {
  formData: { ingredients: Ingredients[] };
  handleChange: (name: string, value: any) => void;
}

const IngredientsForm: FC<IngredientsFormProps> = ({ formData, handleChange }) => {
  const [currentIngredient, setCurrentIngredient] = useState<Ingredients>({
    name: '',
    amount: 0,
    unit: 'ea'
  });

  const addIngredient = () => {
    handleChange('ingredients', [...formData.ingredients, currentIngredient]);
    setCurrentIngredient({ name: '', amount: 0, unit: 'ea' });
  };

  const updateIngredientAmount = (name: string, amount: number) => {
    const updatedIngredients = formData.ingredients.map((ingredient) =>
      ingredient.name === name ? { ...ingredient, amount } : ingredient
    );
    handleChange('ingredients', updatedIngredients);
  };

  const updateUnit = (name: string, unit: Unit) => {
    const updatedIngredients = formData.ingredients.map((ingredient) =>
      ingredient.name === name ? { ...ingredient, unit } : ingredient
    );
    handleChange('ingredients', updatedIngredients);
  };

  const deleteIngredient = (name: string) => {
    const updatedIngredients = formData.ingredients.filter(
      (ingredient) => ingredient.name !== name
    );
    handleChange('ingredients', updatedIngredients);
  };


  return (
    <Stack spacing={4} w={"100%"}>
      <Heading size="md">Step 3: Add Ingredients</Heading>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        height="100%"
      >
          <Input
              placeholder="e.g tomato"
              value={currentIngredient.name}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
              width="30%"
          />
          <NumberInput 
              min={0}
              placeholder="0"
              onChange={(value) => setCurrentIngredient({ ...currentIngredient, amount: parseFloat(value) })}
              width="30%"
          >
            <NumberInputField />
          </NumberInput>
          <Select
              placeholder="Select Unit"
              value={currentIngredient.unit}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value as Unit })}
              width="25%"
          >
            {units.map((unit) => {
                return <option value={unit}>{unit}</option>
            })}
          </Select>
          <Button onClick={addIngredient} rightIcon={<AddIcon />} disabled={currentIngredient.name === '' || currentIngredient.amount === 0}>
              Add
          </Button>
      </Box>

      <Table>
        <Thead>
            <Tr>
            <Th>Food Name</Th>
            <Th>Quantity</Th>
            <Th isNumeric>Action</Th>
            </Tr>
        </Thead>
        <Tbody>
            {formData.ingredients && formData.ingredients.map((ingredient) =>{
                return(
                    <Tr>
                      <Td>
                          {ingredient.name}
                      </Td>
                      <Td>                        
                          <InputGroup>
                              <Input
                                  value={ingredient.amount}
                                  name={ingredient.name}
                                  type="number"
                                  onChange={(e) =>
                                    updateIngredientAmount(
                                      ingredient.name,
                                      parseFloat(e.target.value)
                                    )
                                  }
                              >
                              </Input>
                              <InputRightAddon children={ingredient.unit} />
                          </InputGroup>
                      </Td>
                      <Td isNumeric>
                          <ButtonGroup>
                              <Menu>
                                  <MenuButton as={Button} colorScheme={'green'} rightIcon={<ChevronDownIcon />}>
                                      Switch Unit
                                  </MenuButton>
                                  <MenuList>
                                      {units.map((unit)=>{
                                          return <MenuItem onClick={()=>{updateUnit(ingredient.name, unit)}}>{unit}</MenuItem>
                                      })}
                                  </MenuList>
                              </Menu>
                              <Button colorScheme={'red'} onClick={() => {deleteIngredient(ingredient.name)}} rightIcon={<DeleteIcon/>}>Delete</Button>
                          </ButtonGroup>
                      </Td>
                  </Tr>
                )
            })}
        </Tbody>
    </Table>
    </Stack>
  );
};

export default IngredientsForm;
