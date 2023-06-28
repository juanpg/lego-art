import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";

export default function Stats({pixels}) {
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

          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>    
  );
}