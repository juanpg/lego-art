import { Stack, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Alert, AlertIcon, AlertDescription, AlertTitle, AlertDialogCloseButton, IconButton } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { TbResize } from 'react-icons/tb'
import { LegoArtContext } from "../Context/LegoArtContext"

export default function CanvasDimensions({reset}) {
  const { dimensions, onDimensionsChange } = useContext(LegoArtContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [width, setWidth] = useState(dimensions.width);
  const [height, setHeight] = useState(dimensions.height);

  const onSave = () => {
    onDimensionsChange(width, height);
    reset();
    onClose();
  }

  return (
    <>
      <IconButton 
        onClick={onOpen} 
        icon={<TbResize />}
        aria-label="Change dimensions"
      />
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Change dimensions
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Alert status='warning'>
                <AlertIcon />
                <AlertTitle>
                  Warning:
                </AlertTitle>
                <AlertDescription>
                  Changing the dimensions will reset your current drawing.
                </AlertDescription>
              </Alert>
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Plates Width: </FormLabel>
                  <NumberInput defaultValue={width} min={1} max={5} onChange={setWidth}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Plates Height: </FormLabel>
                  <NumberInput defaultValue={height} min={1} max={5} onChange={setHeight}>
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
              <Button onClick={onClose} ml={3}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
