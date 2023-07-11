import { useContext } from "react";
import { Button, ButtonGroup, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, useDisclosure, PopoverFooter, Flex, IconButton } from '@chakra-ui/react';
import { CirclePicker } from 'react-color';
import { LegoArtContext } from "../Context/LegoArtContext";
import { BsFillCircleFill } from 'react-icons/bs'

export default function ColorPicker({...props}) {
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
        <IconButton
          icon={<BsFillCircleFill />}
          aria-label="Change current color"
          title="Change current color"
          color={currentColor}
          {...props}
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
          {null && (
          <ButtonGroup>
            <Button size='xs' isDisabled>Add</Button>
            <Button size='xs' isDisabled>Remove</Button>
            <Button size='xs' isDisabled>Reset</Button>
          </ButtonGroup>
          )}
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}