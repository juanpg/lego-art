import { IconButton,
} from "@chakra-ui/react";

import { useContext, useState } from 'react';
import { AiOutlineFileImage as IconImage } from 'react-icons/ai';
import { LegoArtContext } from "../Context/LegoArtContext";

export default function FileSave({ pixels, ...props }) {
  const handleSave = () => {
    
  }

  return (
    <IconButton
      aria-label="Save image"
      title="Save image"
      onClick={handleSave}
      icon={<IconImage />}
      {...props}
    />
  );
}