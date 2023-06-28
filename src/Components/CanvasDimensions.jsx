import { Stack, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Alert, AlertIcon, AlertDescription, AlertTitle, AlertDialogCloseButton, IconButton } from "@chakra-ui/react"
import { useContext, useRef, useState } from "react"
import { TbNewSection } from 'react-icons/tb'
import { LegoArtContext } from "../Context/LegoArtContext"

export default function CanvasDimensions() {
  const { dimensions, onDimensionsChange } = useContext(LegoArtContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [width, setWidth] = useState(dimensions[0]);
  const [height, setHeight] = useState(dimensions[1]);

  const cancelRef = useRef(null);

  const onSave = () => {
    onDimensionsChange(parseInt(width), parseInt(height));
    onClose();
  }

  return (
    <>
      <IconButton 
        onClick={onOpen} 
        icon={<TbNewSection />}
        aria-label="New"
        title='New'
      />
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              New image
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              {/* <Alert status='warning'>
                <AlertIcon />
                <AlertTitle>
                  Warning:
                </AlertTitle>
                <AlertDescription>
                  Changing the dimensions will reset your current drawing.
                </AlertDescription>
              </Alert> */}
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Plates Width: </FormLabel>
                  <NumberInput defaultValue={width} min={1} max={3} onChange={setWidth}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Plates Height: </FormLabel>
                  <NumberInput defaultValue={height} min={1} max={3} onChange={setHeight}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Stack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme='blue' onClick={onSave}>
                Save
              </Button>
              <Button onClick={onClose} ml={3} ref={cancelRef}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
