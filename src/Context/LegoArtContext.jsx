import { createContext, useState } from "react";

const defaultColors = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  white: '#FFFFFF',
  black: '#000000'
};

const tools = ['pencil', 'bucket']

export const LegoArtContext = createContext({
  tools,
  canvasSize: [],
  image: null,
  currentTool: '',
  changeTool: () => {},
  currentColor: '',
  changeColor: () => {},
});

export const SQUARE_SIZE = 16;

export function LegoArtProvider({ children }) {
  const [canvasSize, setCanvasSize] = useState([1, 1]);

  const imageWidth = canvasSize[0] * SQUARE_SIZE;
  const imageHeight = canvasSize[1] * SQUARE_SIZE;

  const [image, setImage] = useState(new Array(imageWidth * imageHeight).fill(colors.white));
  const [currentTool, setCurrentTool] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);

  const [history, setHistory] = useState([])

  const newCanvas = (width, height) => {
    setCanvasSize([width, height]);
    setImage(new Array(width * SQUARE_SIZE * height * SQUARE_SIZE ).fill(colors.white))
  }

  const pixelAt = (x, y) => {
    return image[x + y * imageWidth]
  }

  const draw = (newImage) => {
    setHistory([...history, newImage]);
    setImage(newImage)
  }

  const undo = () => {

  }

  const redo = () => {

  }

  const changeTool = (newTool) => {
    if(tools[newTool]) {
      setCurrentTool(newTool)
    }
  }

  const changeColor = (newColor) => {

  }

  return (
    <LegoArtContext.Provider 
      value={{
        tools,
        canvasSize,
        newCanvas,
        pixelAt,
        draw,
        history,
        undo,
        redo,
        image,
        currentTool,
        changeTool,
        currentColor,
        changeColor
      }}
    >
      {children}
    </LegoArtContext.Provider>
  );
}