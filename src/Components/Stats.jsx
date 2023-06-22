import { Box } from "@chakra-ui/react";
import { useContext } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";

export default function Stats() {
  const { colors } = useContext(LegoArtContext);
  return (
    <Box>
      Stud count:
    </Box>
  )
}