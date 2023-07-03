import { useDisclosure, 
  Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, FormErrorMessage, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Button, IconButton, Stack, Box, Heading, Image, Flex, Spacer, Divider, AspectRatio,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useRef, useContext, useState, useEffect } from 'react';
import { AiOutlineFileSearch as IconImage, AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { LegoArtContext } from "../Context/LegoArtContext";
import Draggable from "react-draggable";
import { useWindowWidth } from "../Hooks/useWindowWidth";

const rgbToHex = ({r, g, b}) => {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error("Invalid RGB values. Values must be between 0 and 255.");
  }
  return "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

const hexToRgb = (hex) => {
  if (!/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
    throw new Error("Invalid hexadecimal string. Expected format: #rrggbb or #rgb.");
  }
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

const distanceBetweenColors = ({r: red1, g: green1, b: blue1}, {r: red2, g: green2, b: blue2}) => {
  returnMath.sqrt(
    Math.pow(red1 - red2, 2) +
    Math.pow(green1 - green2, 2) +
    Math.pow(blue1 - blue2, 2)
  );
}

export default function FileLoad({ onLoadImage, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dimensions, squaresPerPlate, colors } = useContext(LegoArtContext);
  const [ platesWidth, setPlatesWidth ] = useState(dimensions[0]);
  const [ platesHeight, setPlatesHeight ] = useState(dimensions[1]);
  const [ file, setFile ] = useState(null);
  const [ fileDataURL, setFileDataURL ] = useState(null);
  const [ zoom, setZoom ] = useState(1);
  const windowWidth = useWindowWidth();

  const canvasSize = useBreakpointValue({
    base: 420, // Math.max(420, windowWidth),
    // sm: 420, // Math.max(420, windowWidth),
    md: 340,
    lg: 420,
    xl: 590
  });

  let canvasWidth = canvasSize;
  let canvasHeight = canvasSize;

  // if(windowWidth < 768) {
  //   canvasWidth = windowWidth;
  //   canvasHeight = windowWidth;
  // }

  if(platesWidth > platesHeight) {

  }

  const [ fileImageBounds, setFileImageBounds ] = useState({
    top: 0, left: 0, right: 0, bottom: 0
  });
  const [ fileImageDimensions, setFileImageDimensions ] = useState([canvasSize, canvasSize]);

  const [ deltaDragPosition, setDeltaDragPosition ] = useState({x: 0, y: 0})

  const initialRef = useRef(null);
  const dragRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  
  // When a file is selected, read its data
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

  // When the window is resized, we need to redraw the <img> to account for the new window size
  useEffect(() => {
    if(file) {
      handleImageLoad()
    }
  }, [canvasSize]);

  // When
  useEffect(() => {
    if(imageRef.current && imageRef.current.src) {
      convertImageToStuds();
    }
  }, [deltaDragPosition])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  }

  const convertImageToStuds = () => {
    const [fullImageWidth, fullImageHeight] = [imageRef.current.naturalWidth, imageRef.current.naturalHeight];

    // console.log(deltaDragPosition);

    // let canvasWidth = platesWidth;
    // let canvasHeight = platesWidth;

    // if(width === height) {
    //   canvasHeight = Math.min(imgWidth, imgHeight);
    //   canvasWidth = Math.min(imgWidth, imgHeight);
    // }
    
    // const offscreen = new OffscreenCanvas(canvasWidth, canvasHeight);
    // const ctx = offscreen.getContext('2d');

    // ctx.drawImage(imageRef.current, -deltaDragPosition.x, -deltaDragPosition.y, imgWidth, imgHeight, 0, 0, canvasWidth, canvasHeight);

    // const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    // console.log([canvasWidth, canvasHeight], [imgWidth, imgHeight], imageData);
  }

  const handleImageLoad = () => {
    const [fullImageWidth, fullImageHeight] = [imageRef.current.naturalWidth, imageRef.current.naturalHeight];



    // if(width === height) {
    //   if(imgWidth > imgHeight) {
    //     const newHeight = canvasSize;
    //     const newWidth = Math.round(canvasSize * imgWidth / imgHeight, 0);

    //     setRectHeight(newHeight);
    //     setRectWidth(newWidth);
    //     setRectBounds({
    //       top: 0,
    //       bottom: 0,
    //       left: -(newWidth - canvasSize),
    //       right: 0
    //     });

    //     setDeltaPosition(dp => { return {x: 0, y: 0}; });
    //   } else {
    //     const newHeight = Math.round(canvasSize * imgHeight / imgWidth, 0);
    //     const newWidth = canvasSize;;

    //     setRectHeight(newHeight);
    //     setRectWidth(newWidth);

    //     setRectBounds({
    //       top: -(newHeight - canvasSize),
    //       bottom: 0,
    //       left: 0,
    //       right: 0
    //     });
    //   }
    // }
  }

  const handleDragOnStart = (e, ui) => {
    e.preventDefault();
  }

  const handleDragOnStop = (e, ui) => {
    const newDeltaDrag = {x: ui.x, y: ui.y};
    setDeltaDragPosition(dp => newDeltaDrag);

    convertImageToStuds();
  }

  const handleLoadClick = () => {
    // TODO
    // onLoadImage(width, height, pixels)
  }

  return (
    <>
      <IconButton
        aria-label="Open image"
        title="Open image"
        onClick={onOpen}
        icon={<IconImage />}
        {...props}
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
                <NumberInput defaultValue={platesWidth} min={1} max={3} onChange={setPlatesWidth}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {platesWidth.length === 0 && (
                  <FormErrorMessage>Width is required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired flexGrow={1}>
                <FormLabel>Plates Height: </FormLabel>
                <NumberInput defaultValue={platesHeight} min={1} max={3} onChange={setPlatesHeight}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {platesHeight.length === 0 && (
                  <FormErrorMessage>Height is required</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Divider my={5} />
            <Flex direction={{base: 'column', md: platesWidth > platesHeight ? 'column' : 'row'}} gap={5}>
              <Box w='full'>
                <Heading as='h3' fontSize='lg'>Image preview</Heading>
                <div style={{ 
                  height: `${canvasHeight}px`,
                  width: `${canvasWidth}px`,
                  border: 'solid 1px black',
                  }}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    {file && (
                    <Draggable nodeRef={dragRef} onStart={handleDragOnStart} onStop={handleDragOnStop} bounds={fileImageBounds}>
                      <div ref={dragRef}  style={{ overflow: 'hidden', position: 'relative', width: fileImageDimensions[0], height: fileImageDimensions[1] }}>
                        <img 
                          ref={imageRef} 
                          src={fileDataURL} 
                          onLoad={handleImageLoad} 
                          width={fileImageDimensions[0]}
                          height={fileImageDimensions[1]}
                          title="Image preview"
                        />
                      </div>
                    </Draggable>
                    )}
                  </div>
                </div>
                <Box>
                  <IconButton
                    icon={<AiOutlineZoomIn />}
                    aria-label="Zoom in"
                    title="Zoom out"
                    isDisabled
                  />
                  <IconButton
                    icon={<AiOutlineZoomOut />}
                    aria-label="Zoom out"
                    title="Zoom out"
                    isDisabled
                  />
                </Box>
              </Box>
              <Spacer />
              <Box w='full'>
                <Heading as='h3' fontSize='lg'>Lego art preview</Heading>
                <div style={{ 
                  height: `${canvasHeight}px`,
                  width: `${canvasWidth}px`,
                  border: 'solid 1px black',
                  }}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ overflow: 'hidden', position: 'relative', width: fileImageDimensions[0], height: fileImageDimensions[1]  }}>
                      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
                    </div>
                  </div>
                  
                </div>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleLoadClick} isDisabled={true} >
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