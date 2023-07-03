import { useBreakpointValue } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { BsPencil, BsPaintBucket, BsEraser, BsEyedropper } from 'react-icons/bs'
import { FaRegHandPointer } from 'react-icons/fa'

// const DEFAULT_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#000000", "#ffffff"];
const DEFAULT_COLORS = [
  '#2f2b2c',  //1
  '#1b4c7a', 
  '#00aef8',  //3
  '#cbeeef', 
  '#e3e8e8',  //5
  '#eeb8ed', 
  '#d71017',  //7
  '#f97c00', 
  '#e7ad00',  //9
  '#e8c600', 
  '#e5de7a',  //11
  '#d2c39a', 
  '#bc804f',  //13
  '#6d361f', 
  '#2dbc49',  //15
  '#a9c600', 
];

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
  dimensions: [1, 1],
  onDimensionsChange: () => {},
  getPixelsPerSquare: (width, height, zoomLevel) => PIXELS_PER_SQUARE,
  tools,
  colors: DEFAULT_COLORS,
  currentColor: '#FFFFFF',
  onColorChange: () => {},
});

export function LegoArtProvider({ children }) {
  const [dimensions, setDimensions] = useState([1, 1]);
  const [zoomLevel, setZoomLevel] = useState(1);

  // const pixelsPerSquare = useBreakpointValue({
  //   base: [18, 30, 42, 48][zoomLevel-1], // / dimensions[0] ,
  //   md: [30, 42, 48, 54][zoomLevel-1], // / dimensions[0],
  //   lg: [42, 48, 54, 60][zoomLevel-1], // / dimensions[0],
  //   xl: [48, 54, 60, 66][zoomLevel-1], // / dimensions[0]
  // }) / (dimensions[0] !== dimensions[1] ? Math.min(...dimensions) : dimensions[0]) ;
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLORS[1]);
  const [currentTool, setCurrentTool] = useState('pencil');

  const pixelSizes = useBreakpointValue({
    base: [18, 30, 42, 48], // / dimensions[0] ,
    md: [30, 42, 48, 54], // / dimensions[0],
    lg: [42, 48, 54, 60], // / dimensions[0],
    xl: [48, 54, 60, 66], // / dimensions[0]
  });

  const getPixelsPerSquare = (width, height, zoomLevel) => {
    return pixelSizes[zoomLevel - 1] / (width !== height ? Math.min(width, height) : width) ;
  }

  const drawPixel = (ctx, {x, y, color}, pps) => {
    if(pps === null || pps === undefined) {
      pps = getPixelsPerSquare(dimensions[0], dimensions[1], zoomLevel);
    }
    ctx.fillStyle = color ?? '#111111';
  
    ctx.beginPath();
    ctx.arc(x * pps + pps / 2, y * pps + pps / 2, pps / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  const onDimensionsChange = (width, height) => {
    setDimensions(d => [width, height]);
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
        getPixelsPerSquare,
        tools,
        currentTool,
        onToolChange,
        colors,
        onColorAdd,
        onColorRemove,
        currentColor,
        onColorChange,
        drawPixel
      }}
    >
      {children}
    </LegoArtContext.Provider>
  );
}