import { useContext } from "react";
import { Button, ButtonGroup, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, useDisclosure, PopoverFooter, Flex } from '@chakra-ui/react';
import { CirclePicker } from 'react-color';
import { LegoArtContext } from "../Context/LegoArtContext";

export default function ColorPicker() {
  const { colors, currentColor, onColorChange } = useContext(LegoArtContext);
  const { isOpen, onOpen, onClose: onChangeColorClose } = useDisclosure();

  const handleColorChange = (color) => {
    onColorChange(color.hex);
    onChangeColorClose();
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onChangeColorClose}
    >
      <PopoverTrigger>
        <Button 
          bg={currentColor} 
          borderRadius={'50%'} 
          borderColor='black'
          borderWidth='thin'
          size='xs'
          aria-label='Change current color'
          title='Change current color'
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>Change current color</PopoverHeader>
        <PopoverBody p={4}>
          <Flex justifyContent='center' alignItems='center'>
            <CirclePicker
              color={currentColor}
              onChangeComplete={handleColorChange}
              colors={colors}
              width='100%'
              circleSize={28}
              circleSpacing={12}
            />
          </Flex>
        </PopoverBody>
        <PopoverFooter>
          <ButtonGroup>
            <Button>Add Color</Button>
            <Button>Remove Color</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}