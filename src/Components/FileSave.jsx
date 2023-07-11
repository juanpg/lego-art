import { IconButton,
  Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Input,
  useDisclosure,
  Button, Link, Heading
} from "@chakra-ui/react";

import { useContext, useState, useRef } from 'react';
import { AiOutlineFileImage as IconImage } from 'react-icons/ai';
import { LegoArtContext } from "../Context/LegoArtContext";

export default function FileSave({ pixels, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dimensions, squaresPerPlate, colors, drawPixel } = useContext(LegoArtContext);

  const [fileName, setFileName] = useState("lego-art");

  const initialRef = useRef(null);

  const createImageData = () => {
    const size = 960;
    const width = dimensions[0] * size;
    const height = dimensions[1] * size;
    const pixelsPerSquare = width / (dimensions[0] * squaresPerPlate);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, width, height);

    ctx.strokeStyle = '#777777';

    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if(color) {
          drawPixel(ctx, {x, y, color}, pixelsPerSquare);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x * pixelsPerSquare + pixelsPerSquare / 2, y * pixelsPerSquare + pixelsPerSquare / 2, pixelsPerSquare / 2, 0, 2 * Math.PI);
          ctx.stroke();
        }
      })
    });

    return canvas.toDataURL();
  }

  const createNumberData = () => {
    const size = 960;
    const width = dimensions[0] * size;
    const height = dimensions[1] * size;
    const pixelsPerSquare = width / (dimensions[0] * squaresPerPlate);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height + pixelsPerSquare * 4;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.strokeRect(pixelsPerSquare /2, height + pixelsPerSquare / 2, colors.length / 2 * pixelsPerSquare * 1.5 + pixelsPerSquare / 2, pixelsPerSquare * 2 + pixelsPerSquare);

    ctx.strokeStyle = '#777777';

    ctx.font = `${Math.floor(pixelsPerSquare / 3)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    colors.forEach((color, index) => {
      const x = pixelsPerSquare + 1.5 * (index % (colors.length / 2)) * pixelsPerSquare + pixelsPerSquare / 2;
      const y = height + pixelsPerSquare * (1 + Math.floor(index / (colors.length / 2))) + pixelsPerSquare / 2;

      ctx.fillStyle = color;
  
      ctx.beginPath();
      ctx.arc(x, y, pixelsPerSquare / 2 * 0.8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.fillText(index, x, y);
    })

    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.beginPath();
        ctx.arc(x * pixelsPerSquare + pixelsPerSquare / 2, y * pixelsPerSquare + pixelsPerSquare / 2, pixelsPerSquare / 2, 0, 2 * Math.PI);
        ctx.stroke();

        if(color) {
          ctx.fillStyle = '#000000';
          ctx.fillText(colors.indexOf(color), x * pixelsPerSquare + pixelsPerSquare / 2, y * pixelsPerSquare + pixelsPerSquare / 2);
        } else {
        }
      })
    });

    return canvas.toDataURL();
  }

  const imageURL = createImageData();
  const numberURL = createNumberData();

  return (
    <>
      <IconButton
        aria-label="Save image"
        title="Save image"
        onClick={onOpen}
        icon={<IconImage />}
        {...props}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='4xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired mb={4}>
              <FormLabel>Image Name: </FormLabel>
              <Input ref={initialRef} value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Image file name" mb={2} />
              <Link color='blue.400' download={`${fileName ?? 'lego-art'}.png`} href={imageURL}>
                <Heading fontSize='md' ml={1}>Download</Heading>
              </Link>
            </FormControl>
            <FormControl>
              <FormLabel>Color-by-number image</FormLabel>
              <Link color='blue.400' download={`${fileName ?? 'lego-art'}-by-number.png`} href={numberURL}>
                <Heading fontSize='md' ml={1}>Download</Heading>
              </Link>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}