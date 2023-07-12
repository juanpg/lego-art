import { useDisclosure, 
  Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, FormErrorMessage, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Button, IconButton, Box, Heading, Flex, Spacer, Divider,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useRef, useContext, useState, useEffect } from 'react';
import { AiOutlineFileSearch as IconImage, AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { LegoArtContext } from "../Context/LegoArtContext";
import Draggable from "react-draggable";
import { closest } from "color-diff";

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

const closestPaletteColor = (color, palette) => {
  const rgb1 = hexToRgb(color);
  const rgbColors = palette.map(hexToRgb);

  return rgbToHex(closest(rgb1, rgbColors));
}

const calculateMaxWidth = (windowWith, platesWidth, squaresPerPlate) => {
  const MIN_WIDTH = 320;
  const MAX_WIDTH = 848;

  if(windowWith < MIN_WIDTH) {
    return MIN_WIDTH;
  }
  
  if(windowWith > MAX_WIDTH) {
    return MAX_WIDTH;
  }

  return Math.floor(windowWith / (platesWidth * squaresPerPlate)) * platesWidth * squaresPerPlate;
}

export default function FileLoad({ onLoadImage, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dimensions, squaresPerPlate, colors, getPixelsPerSquare, drawPixel } = useContext(LegoArtContext);
  const [ platesWidth, setPlatesWidth ] = useState(dimensions[0]);
  const [ platesHeight, setPlatesHeight ] = useState(dimensions[1]);
  const [ file, setFile ] = useState(null);
  const [ fileDataURL, setFileDataURL ] = useState(null);
  const [ zoom, setZoom ] = useState(1);
  const [ pixels, setPixels ] = useState(null);
  
  const maxWidth = useBreakpointValue({
    base: 400,
    sm: 400,
    md: 352,
    lg: 416,
  })

  const canvasWidth = calculateMaxWidth(maxWidth, platesWidth, squaresPerPlate);

  const pixelsPerSquare = canvasWidth / (platesWidth * squaresPerPlate);
  const canvasHeight = parseInt(platesHeight) * squaresPerPlate * pixelsPerSquare;

  const [ fileImageBounds, setFileImageBounds ] = useState({
    top: 0, left: 0, right: 0, bottom: 0
  });
  const [ fileImageDimensions, setFileImageDimensions ] = useState([canvasWidth, canvasHeight]);
  const [ fileImagePosition, setFileImagePosition ] = useState({x: 0, y: 0});

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
  }, [file, platesWidth, platesHeight, zoom]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setZoom(z => 1)
      setFile(f => file);
    } else {
      setFile(f => null);
      setFileDataURL(fd => null);
    }
  }

  const handleImageLoad = () => {
    // console.log(imageRef.current.naturalWidth);
    const [fullImageWidth, fullImageHeight] = [imageRef.current.naturalWidth, imageRef.current.naturalHeight];

    if(fullImageWidth === 0 || fullImageHeight === 0) {
      return;
    }

    let newWidth = 0, newHeight = 0;

    const widthRatio = fullImageWidth / canvasWidth;
    const heightRatio = fullImageHeight / canvasHeight;

    if(widthRatio < heightRatio) {
      newWidth = canvasWidth * zoom;
      newHeight = fullImageHeight / fullImageWidth *  newWidth;
    } else {
      newHeight = canvasHeight * zoom
      newWidth = fullImageWidth / fullImageHeight * newHeight;
    }

    setFileImagePosition(ip => { return { x: 0, y: 0} });
    setFileImageDimensions(id => { return [newWidth, newHeight] });
    setFileImageBounds(ib => { return { top: -(newHeight -canvasHeight), left: -(newWidth - canvasWidth), right: 0, bottom: 0 }; });

    convertImageToStuds();
  }

  const convertImageToStuds = () => {
    if(!canvasRef.current) {
      return;
    }

    const cr = canvasRef.current;

    const newPixels = Array(platesHeight * squaresPerPlate).fill(null).map(() => Array(platesWidth * squaresPerPlate).fill(null));

    const ctx = cr.getContext('2d');
    ctx.clearRect(0, 0, cr.width, cr.height);
  
    ctx.globalCompositeOperation = 'destination-under';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cr.width, cr.height);

    if(file && imageRef.current) {
      const ir = imageRef.current;
      const w = canvasWidth / ir.width * ir.naturalWidth;
      const h = canvasHeight / ir.height * ir.naturalHeight;
      const deltaX = ir.naturalWidth / ir.width * fileImagePosition.x;
      const deltaY = ir.naturalHeight / ir.height * fileImagePosition.y;

      const offCanvas = new OffscreenCanvas(canvasWidth, canvasHeight);
      const offCtx = offCanvas.getContext('2d', {willReadFrequently: true});
      offCtx.drawImage(ir, -deltaX, -deltaY, w, h, 0, 0, canvasWidth, canvasHeight);

      const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;

      const [squaresX, squaresY] = [Math.floor(canvasWidth / pixelsPerSquare), Math.floor(canvasHeight / pixelsPerSquare)];

      // console.log('before', pixels);
      
      for (let y = 0; y < squaresY; y++) {
        for (let x = 0; x < squaresX; x++) {
          let sumR = 0
          let sumG = 0
          let sumB = 0;
          let count = 0;
          for(let i = 0; i < pixelsPerSquare; i++) {
            for (let j = 0; j < pixelsPerSquare; j++) {

              const dx = (y * pixelsPerSquare + j) * canvasWidth * 4 + (x * pixelsPerSquare + i) * 4;

              if(dx < imageData.length) {
                sumR += imageData[dx];
                sumG += imageData[dx + 1];
                sumB += imageData[dx + 2];
                count++;
              }
            }
          }

          const avgR = Math.round(sumR / count);
          const avgG = Math.round(sumG / count);
          const avgB = Math.round(sumB / count);

          newPixels[y][x] = rgbToHex({ r: avgR, g: avgG, b: avgB });
          newPixels[y][x] = closestPaletteColor( newPixels[y][x] , colors);

        }
      }
    }

    newPixels.forEach((row, y) => {
      row.forEach((color, x) => {
        drawPixel(ctx, {x, y, color}, pixelsPerSquare);
      })
    });

    setPixels(newPixels);
  }

   const handleDragOnStart = (e, ui) => {
    e.preventDefault();
  }

  const handleDragOnStop = (e, ui) => {
    setFileImagePosition(ip => { return {x: ui.x, y: ui.y} });
    convertImageToStuds();
  }

  const handleDrag = (e, ui) => {
    setFileImagePosition(ip => { return {x: ui.x, y: ui.y} });
  }

  const handleZoom = (delta) => {
    setZoom(z => z + delta);
    convertImageToStuds();
  }

  const handleLoadClick = () => {
    if(pixels) {
      onLoadImage(parseInt(platesWidth), parseInt(platesHeight), pixels)
      onClose();
    }
  }

  const handleLoadCancel = () => {
    onClose();
    setFile(null);
    setFileDataURL(null);
    setZoom(1);
    setPlatesWidth(dimensions[0]);
    setPlatesHeight(dimensions[1]);

    setFileImageBounds({ top: 0, left: 0, right: 0, bottom: 0 });
    setFileImagePosition({ x: 0, y: 0 });
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
        onClose={handleLoadCancel}
        size='4xl'
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
                <NumberInput defaultValue={platesWidth} min={1} max={3} onChange={(newWidth) => { setPlatesWidth(w => newWidth); convertImageToStuds(); }}>
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
                <NumberInput defaultValue={platesHeight} min={1} max={3} onChange={(newHeight) => {setPlatesHeight(h => newHeight); convertImageToStuds(); }}>
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
            <Flex direction={{base: 'column', md: 'row'}} gap={2}>
              <Box w='full'>
                <Heading as='h3' fontSize='lg'>Image preview</Heading>
                <div style={{ 
                  height: canvasHeight,
                  width: canvasWidth,
                  border: 'solid 1px black',
                  boxSizing: 'content-box'
                  }}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    {file && (
                    <Draggable nodeRef={dragRef} onStart={handleDragOnStart} onStop={handleDragOnStop} onDrag={handleDrag} bounds={fileImageBounds} position={ fileImagePosition }>
                      <div ref={dragRef}  style={{ 
                        overflow: 'hidden', 
                        position: 'relative', 
                        width: fileImageDimensions[0], 
                        height: fileImageDimensions[1] }}
                      >
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
                    title="Zoom in"
                    isDisabled={!file || zoom >= 4}
                    onClick={() => handleZoom(0.5)}
                  />
                  <IconButton
                    icon={<AiOutlineZoomOut />}
                    aria-label="Zoom out"
                    title="Zoom out"
                    isDisabled={!file || zoom <= 1}
                    onClick={() => handleZoom(-0.5)}
                  />
                </Box>
              </Box>
              <Spacer />
              <Box w='full'>
                <Heading as='h3' fontSize='lg'>Lego art preview</Heading>
                <div style={{ 
                  height: canvasHeight,
                  width: canvasWidth,
                  border: 'solid 1px black',
                  boxSizing: 'content-box'
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    position: 'relative', 
                    overflow: 'hidden' }}
                  >
                    <div style={{ 
                      overflow: 'hidden', 
                      position: 'relative', 
                      width: fileImageDimensions[0], 
                      height: fileImageDimensions[1]  }}
                    >
                      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
                    </div>
                  </div>
                  
                </div>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleLoadClick} isDisabled={pixels === null} >
              Load
            </Button>
            <Button onClick={handleLoadCancel} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}