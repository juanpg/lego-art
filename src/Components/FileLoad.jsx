import { useDisclosure, 
  Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, FormErrorMessage, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Button, IconButton, Stack, Box, Heading, Image, Flex, Spacer, Divider,
} from "@chakra-ui/react";

import { useRef, useContext, useState, useEffect } from 'react';
import { AiOutlineFileSearch as IconImage } from 'react-icons/ai';
import { LegoArtContext } from "../Context/LegoArtContext";


export default function FileLoad() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dimensions, onDimensionsChange } = useContext(LegoArtContext);
  const [ width, setWidth ] = useState(dimensions[0]);
  const [ height, setHeight ] = useState(dimensions[1]);
  const [ file, setFile ] = useState(null);
  const [ fileDataURL, setFileDataURL ] = useState(null);

  const [ rectTop, setRectTop ] = useState(0);
  const [ rectLeft, setRectLeft ] = useState(0);
  const [ rectWidth, setRectWidth ] = useState(null);
  const [ rectHeight, setRectHeight ] = useState(null);

  const initialRef = useRef(null);
  const imageRef = useRef(null);

  const dragging = useRef(false);
  
  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  }

  const handleImageLoad = (e) => {
    const [imgWidth, imgHeight] = [Math.max(imageRef.current.naturalWidth, imageRef.current.width), Math.max(imageRef.current.naturalHeight, imageRef.current.height)];
    const aspectRatio = width / height;

    setRectHeight(imgHeight);
    setRectWidth(imgWidth);
  }

  

  const handleLoad = () => {
    // TODO
  }

  return (
    <>
      <IconButton
        aria-label="Open image"
        title="Open image"
        onClick={onOpen}
        icon={<IconImage />}
        fontSize='24px'
      />
      <Modal
        isOpen={isOpen}
        initialFocusRef={initialRef}
        onClose={onClose}
        size='full'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load an image</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={5}>
              <FormControl isRequired flexGrow={{ base: 1, md: 2 }}>
                <FormLabel>File: </FormLabel>
                <Input type='file' ref={initialRef} multiple={false} accept="image/*" onChange={handleFileChange} />
              </FormControl>
              <FormControl isRequired flexGrow={1} >
                <FormLabel>Plates Width: </FormLabel>
                <NumberInput  defaultValue={width} min={1} max={3} onChange={setWidth}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {width.length === 0 && (
                  <FormErrorMessage>Width is required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired flexGrow={1}>
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
            </Flex>
            <Divider my={5} />
            <Flex direction={{base: 'column', md: 'row'}} gap={5}>
                <Box w='full'>
                  <Heading as='h3' fontSize='lg'>Image preview</Heading>
                  <Box position='relative'>
                    <Image src={fileDataURL} display='block' onLoad={handleImageLoad} ref={imageRef} />
                    {fileDataURL && (
                      <Box 
                        border='1px solid red' 
                        position='absolute' 
                        top={rectTop}
                        left={rectLeft} 
                        width={rectWidth}
                        height={rectHeight}
                        aspectRatio={`${width}/${height}`}
                        objectFit='contain'
                      >
                        <Box
                          position='absolute'
                          right={0}
                          bottom={0}
                          
                        >
                          <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" stroke="red">
                            <path d="m14.228 16.227a1 1 0 0 1 -.707-1.707l1-1a1 1 0 0 1 1.416 1.414l-1 1a1 1 0 0 1 -.707.293zm-5.638 0a1 1 0 0 1 -.707-1.707l6.638-6.638a1 1 0 0 1 1.416 1.414l-6.638 6.638a1 1 0 0 1 -.707.293zm-5.84 0a1 1 0 0 1 -.707-1.707l12.477-12.477a1 1 0 1 1 1.415 1.414l-12.478 12.477a1 1 0 0 1 -.707.293z" fill="#494c4e"/>
                          </svg>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                </Box>
                <Spacer />
                <Box w='full'>
                  <Heading as='h3' fontSize='lg'>Lego art preview</Heading>
                  <canvas width='100%' style={{ aspectRatio: '1/1' }}></canvas>
                </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleLoad} isDisabled={true} >
              Load
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}