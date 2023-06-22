import { useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";
import { FaRegHandPointer, FaRegHandRock } from 'react-icons/fa';

const drawPixel = (ctx, {x, y, color}, pixelsPerSquare) => {
  ctx.fillStyle = color ?? '#111111';
  // ctx.fillRect(x * pixelsPerSquare, y * pixelsPerSquare, pixelsPerSquare, pixelsPerSquare);

  ctx.beginPath();
  ctx.arc(x * pixelsPerSquare + pixelsPerSquare / 2, y * pixelsPerSquare + pixelsPerSquare / 2, pixelsPerSquare / 2, 0, 2 * Math.PI , )
  ctx.fill();
}

const getPixelCoords = (event, pixelsPerSquare) => {
  const rect = event.target.getBoundingClientRect();
  if(event.clientX < rect.left || event.clientX > rect.left + rect.width || event.clientY < rect.top || event.clientY > rect.top + rect.height ) {
    return {x: null, y: null};
  }
  const x = Math.floor((event.clientX - rect.left) / pixelsPerSquare);
  const y = Math.floor((event.clientY - rect.top) / pixelsPerSquare);

  return {x, y};
}

const getCoordsByIndex = (index, squaresPerPlate, width) => {
  const y = Math.floor(index / (squaresPerPlate * width));
  const x = index - y * squaresPerPlate * width;
  return {x, y}
}

const getIndexByCoords = (x, y, squaresPerPlate, width) => {
  return y * squaresPerPlate * width + x;
}

export default function Canvas({currentPixels, onNewPixels }) {
  const canvasRef = useRef(null);
  const active = useRef(false);
  const [newPixels, setNewPixels] = useState(new Map)
  const { dimensions, currentTool, currentColor, squaresPerPlate, pixelsPerSquare } = useContext(LegoArtContext);
  const { width, height } = dimensions;

  const canvasSize = useBreakpointValue({
    base: 288,
    md: 480,
    lg: 672,
    xl: 768
  });

  const canvasWidth = `${canvasSize}px`;
  const canvasHeight = `${canvasSize}px`;

  useEffect(() => {
    if(canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      ctx.globalCompositeOperation = 'destination-under';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      currentPixels.forEach((row, y) => {
        row.forEach((color, x) => {
          drawPixel(ctx, {x, y, color}, pixelsPerSquare)
        })
        // const {x, y} = getCoordsByIndex(index, squaresPerPlate, width);
        // drawPixel(ctx, {x, y, color}, pixelsPerSquare)
      });
    }
  }, [canvasRef, currentPixels, pixelsPerSquare]);  

  useEffect(() => {
    if(canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      for(const [coords, color] of newPixels.entries()) {
        // const {x, y} = getCoordsByIndex(index, squaresPerPlate, width);
        const [x, y] = coords.split('-');
        drawPixel(ctx, {x, y, color}, pixelsPerSquare)
      }
    }
  }, [newPixels, pixelsPerSquare])

  const handleMove = (event) => {
    if(!active.current) {
      return;
    }

    const {x, y} = getPixelCoords(event, pixelsPerSquare);
    if(x === null || y === null || x < 0 || x >= width * squaresPerPlate || y < 0 || y >= height * squaresPerPlate) {
      return;
    }

    const pixel = {
      x, 
      y,  
      color: currentTool === 'pencil' ? currentColor : '#111111'
    }

    setNewPixels(m => {
      const n = new Map(m);
      // n.set(getIndexByCoords(pixel.x, pixel.y, squaresPerPlate, width), pixel.color)
      n.set(`${x}-${y}`, pixel.color);
      return n;
    })
  }
  
  const handleMouseDown = (event) => {
    if(event.button !== 0) {
      return;
    }

    const {x, y} = getPixelCoords(event, pixelsPerSquare);

    if(x === null || y === null || x < 0 || x >= width * squaresPerPlate || y < 0 || y >= height * squaresPerPlate) {
      return;
    }

    if(currentTool === 'fill') {

      return;
    } else if(currentTool === 'picker') {
      // Set the currentColor to the color of the selected square

      return;
    } else if(currentTool === 'move') {
      // Change mouse, probably need to save where we started 

      return;
    }
    
    active.current = true;

    const pixel = {
      x, 
      y,  
      color: currentTool === 'pencil' ? currentColor : '#111111'
    }

    setNewPixels(m => {
      const n = new Map();
      // n.set(getIndexByCoords(pixel.x, pixel.y, squaresPerPlate, width), pixel.color)
      n.set(`${x}-${y}`, pixel.color);
      return n;
    })
  }

  const handleMouseUp = (event) => {
    active.current = false;

    if(currentTool === 'picker') {
      return;
    }

    // Notify the parent that we're done painting
    // const updatedPixels = [...currentPixels];
    // for(const [index, color] of newPixels.entries()) {
    //   updatedPixels[index] = color;
    // }

    const updatedPixels = currentPixels.map((row, y) => {
      return row.map((color, x) => newPixels.has(`${x}-${y}`) ? newPixels.get(`${x}-${y}`) : color )
    })
    
    onNewPixels(updatedPixels);
  }

  return (
    <>
      <canvas
        width={canvasWidth}
        height={canvasHeight}

        style={{
          borderWidth: '5px',
          borderStyle: 'solid',
          borderRadius: '5px',
          borderColor: useColorModeValue('gray.400', 'whiteAlpha.800'),
        }}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMove}
      >
      </canvas>
    </>
  )
}