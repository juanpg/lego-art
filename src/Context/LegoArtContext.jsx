import { useBreakpointValue } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { BsPencil, BsPaintBucket, BsEraser, BsEyedropper } from 'react-icons/bs'
import { FaRegHandPointer } from 'react-icons/fa'

const DEFAULT_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#000000", "#ffffff"];
const PIXELS_PER_SQUARE = 20;
const SQUARES_PER_PLATE = 16;

const tools = {
  'pencil': {
    icon: <BsPencil />,
    label: 'Pencil'
  }, 
  'fill': {
    icon: <BsPaintBucket />,
    label: 'Fill'
  }, 
  'eraser': {
    icon: <BsEraser />,
    label: 'Eraser'
  },
  'picker': {
    icon: <BsEyedropper />,
    label: 'Color Picker'
  },
  'move': {
    icon: <FaRegHandPointer />,
    label: 'Move'
  }
};

export const LegoArtContext = createContext({
  squaresPerPlate: SQUARES_PER_PLATE,
  dimensions: {width: 1, height: 1},
  onDimensionsChange: () => {},
  pixelsPerSquare: PIXELS_PER_SQUARE,
  tools,
  colors: DEFAULT_COLORS,
  currentColor: '#FFFFFF',
  onColorChange: () => {},
});

export function LegoArtProvider({ children }) {
  const [dimensions, setDimensions] = useState({width: 1, height: 1});
  const [zoomLevel, setZoomLevel] = useState(1);

  const pixelsPerSquare = useBreakpointValue({
    base: [18, 30, 42, 48][zoomLevel-1] / dimensions.width ,
    md: [30, 42, 48, 54][zoomLevel-1] / dimensions.width,
    lg: [42, 48, 54, 60][zoomLevel-1] / dimensions.width,
    xl: [48, 54, 60, 66][zoomLevel-1] / dimensions.width
  });
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [currentColor, setCurrentColor] = useState("#FFFFFF");
  const [currentTool, setCurrentTool] = useState('pencil');

  const onDimensionsChange = (width, height) => {
    setDimensions({width, height});
  }

  const onZoomLevelChange = (zoomLevel) => {
    setZoomLevel(zoomLevel);
  }

  const onColorChange = (newColor) => {
    if(colors.includes(newColor.toLowerCase())) {
      setCurrentColor(newColor.toLowerCase());
    }
  }

  const onToolChange = (newTool) => {
    if(tools[newTool.toLowerCase()]) {
      setCurrentTool(newTool.toLowerCase());
    }
  }

  const onColorAdd = (newColor) => {
    if(!colors.includes(newColor.toLowerCase())) {
      setColors([...colors, newColor.toLowerCase()])
    }
  }

  const onColorRemove = (color) => {
    if(colors.includes(color)) {
      setColors(colors.filter(c => c.toLowerCase() !== color.toLowerCase()));
    }
  }

  return (
    <LegoArtContext.Provider 
      value={{
        squaresPerPlate: SQUARES_PER_PLATE,
        dimensions,
        onDimensionsChange,
        zoomLevel,
        onZoomLevelChange,
        pixelsPerSquare,
        tools,
        currentTool,
        onToolChange,
        colors,
        onColorAdd,
        onColorRemove,
        currentColor,
        onColorChange
      }}
    >
      {children}
    </LegoArtContext.Provider>
  );
}