import { useDisclosure, 
  Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Button, IconButton,
} from "@chakra-ui/react";
import { useRef, useContext, useState } from 'react';
import { AiOutlineFileAdd as IconImage } from 'react-icons/ai'
import { LegoArtContext } from "../Context/LegoArtContext";

export default function FileNew() {
  const { dimensions, onDimensionsChange } = useContext(LegoArtContext);
  const [ width, setWidth ] = useState(dimensions[0]);
  const [ height, setHeight ] = useState(dimensions[1]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const widthRef = useRef(null);

  const onSave = () => {
    onDimensionsChange(parseInt(width), parseInt(height));
    onClose();
  }

  return (
    <>
      <IconButton
        aria-label="New file"
        title="New file"
        onClick={onOpen}
        icon={<IconImage />}
        fontSize='24px'
      />

      <Modal
        initialFocusRef={widthRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Start a new image
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Plates Width: </FormLabel>
              <NumberInput  defaultValue={width} min={1} max={3} onChange={setWidth}>
                <NumberInputField ref={widthRef} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {width.length === 0 && (
                <FormErrorMessage>Width is required</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Plates Height: </FormLabel>
              <NumberInput defaultValue={height} min={1} max={3} onChange={setHeight}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {height.length === 0 && (
                <FormErrorMessage>Height is required</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={onSave} isDisabled={width.length === 0 || height.length === 0} >
              Save
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}