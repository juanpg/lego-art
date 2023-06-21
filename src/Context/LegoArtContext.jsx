import { createContext, useState } from "react";

const DEFAULT_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#000000"];
const DEFAULT_SIZE = 20;
const SQUARE_SIZE = 16;

const tools = ['pencil', 'bucket']

export const LegoArtContext = createContext({
  squareSize: SQUARE_SIZE,
  dimensions: {width: 1, height: 1},
  pixelSize: DEFAULT_SIZE,
  tools,
  colors: DEFAULT_COLORS,
  currentColor: '#000000',
  onColorChange: () => {},
});

export function LegoArtProvider({ children }) {
  const [dimensions, setDimensions] = useState({width: 1, height: 1});
  const [pixelSize, setPixelSize] = useState(DEFAULT_SIZE)
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [currentColor, setCurrentColor] = useState("#000000");

  const onColorChange = (newColor) => {
    if(colors.includes(newColor)) {
      setCurrentColor(newColor);
    }
  }

  const onColorAdd = (newColor) => {
    if(!colors.includes(newColor)) {
      setColors([...colors, newColor])
    }
  }

  const onColorRemove = (color) => {
    if(colors.includes(color)) {
      setColors(colors.filter(c => c !== color));
    }
  }

  return (
    <LegoArtContext.Provider 
      value={{
        squareSize: SQUARE_SIZE,
        dimensions,
        pixelSize,
        tools,
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