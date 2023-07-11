import { Flex, Button, SimpleGrid, Text, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";
import { BsFillCircleFill } from 'react-icons/bs'

export default function Stats({pixels, ...props}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colors } = useContext(LegoArtContext);

  const studsPerColor = colors.reduce((m, color ) => {
    m.set(color, 0);
    return m;
  }, new Map());

  if(pixels) {
    pixels.forEach(row => {
      row.forEach(color => {
        if(color) {
          studsPerColor.set(color, (studsPerColor.get(color) ?? 0) + 1);
        }
      });
    });
  }

  const totalStuds = [...studsPerColor.values()].reduce((total, count) => total + count, 0);

  return (
    <>
      <Button
        onClick={onOpen}
        aria-label="Stud count"
        title="Stud count"
        {...props}
      >
        {totalStuds}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stud count</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={4} spacing={5}>
            {
              colors.map(color => (
                <Flex key={color} direction='row' alignItems='center'>
                  <Icon as={BsFillCircleFill} color={color} mr={2} {...props} boxSize={5} />
                  <Text display='inline-block'>{studsPerColor.get(color)}</Text>
                </Flex>
              ))
            }
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>    
  );
}