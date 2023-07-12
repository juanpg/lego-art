import { useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";

const getPixelCoords = (event, pixelsPerSquare) => {
  const rect = event.target.getBoundingClientRect();
  if(event.clientX < rect.left || event.clientX > rect.left + rect.width || event.clientY < rect.top || event.clientY > rect.top + rect.height ) {
    return {x: null, y: null};
  }
  const x = Math.floor((event.clientX - rect.left) / pixelsPerSquare);
  const y = Math.floor((event.clientY - rect.top) / pixelsPerSquare);

  return {x, y};
}

export default function Canvas({currentPixels, onNewPixels }) {
  const canvasRef = useRef(null);
  const active = useRef(false);
  const [newPixels, setNewPixels] = useState(new Map)
  const { dimensions, currentTool, currentColor, onColorChange, squaresPerPlate, getPixelsPerSquare, drawPixel, zoomLevel } = useContext(LegoArtContext);
  const [ width, height ] = dimensions;

  const pixelsPerSquare = getPixelsPerSquare(dimensions[0], dimensions[1], zoomLevel);

  // const canvasWidth = width > height ? `${plateSize * width}px` : `${plateSize}px`;
  const canvasWidth = `${width * squaresPerPlate *pixelsPerSquare}px`;
  const canvasHeight = `${height * squaresPerPlate * pixelsPerSquare}px`;

  useEffect(() => {
    if(canvasRef.current && currentPixels) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      ctx.globalCompositeOperation = 'destination-under';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      currentPixels.forEach((row, y) => {
        row.forEach((color, x) => {
          drawPixel(ctx, {x, y, color})
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
        drawPixel(ctx, {x, y, color})
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
      color: currentTool === 'pencil' ? currentColor : null
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
      executeFillColor(x, y);
      return;
    } else if(currentTool === 'picker') {
      // Set the currentColor to the color of the selected square
      executePickColor(x, y);
      return;
    } else if(currentTool === 'move') {
      // Change mouse, probably need to save where we started 

      return;
    }
    
    active.current = true;

    const pixel = {
      x, 
      y,  
      color: currentTool === 'pencil' ? currentColor : null
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

  const executeFillColor = (x, y) => {
    const targetColor = currentPixels[y][x];
    const around = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const drawn = [{x, y, color: currentColor}];

    for(let done=0; done < drawn.length; done++) {
      for(const [dx, dy] of around) {
        const x = drawn[done].x + dx;
        const y = drawn[done].y + dy;
        if(x >= 0 && x < width * squaresPerPlate && 
           y >= 0 && y < height * squaresPerPlate &&
           currentPixels[y][x] === targetColor && 
           !drawn.some(p => p.x === x && p.y === y )) {
          drawn.push({x, y, color: currentColor})
        }
      }
    }

    setNewPixels(drawn.reduce((m, {x, y, color}) => {
        m.set(`${x}-${y}`, color);
        return m;
    }, new Map));
  }

  const executePickColor = (x, y) => {
    const targetColor = newPixels.has(`${x}-${y}`) ? newPixels.get(`${x}-${y}`) : currentPixels[y][x];
    onColorChange(targetColor ?? '');
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