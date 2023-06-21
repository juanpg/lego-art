import { useContext, useEffect, useRef, useState } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";

const drawPixel = (ctx, {x, y, color}, pixelSize) => {
  ctx.fillStyle = color ?? '#FFFFFF';
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
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

export default function Canvas({width, height, currentPixels, onNewPixels }) {
  const canvasRef = useRef(null);
  const active = useRef(false);
  const [newPixels, setNewPixels] = useState(new Map)
  const { currentColor, squaresPerPlate, pixelsPerSquare } = useContext(LegoArtContext);
  
  if(canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    currentPixels.forEach((color, index) => {
      const {x, y} = getCoordsByIndex(index, squaresPerPlate, width);
      drawPixel(ctx, {x, y, color}, pixelsPerSquare)
    });
  }

  useEffect(() => {
    if(canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      for(const [index, color] of newPixels.entries()) {
        const {x, y} = getCoordsByIndex(index, squaresPerPlate, width);
        drawPixel(ctx, {x, y, color}, pixelsPerSquare)
      }
    }
  }, [newPixels])

  const handleMove = (event) => {
    if(!active.current) {
      return;
    }

    const {x, y} = getPixelCoords(event, pixelsPerSquare);
    if(x === null || y === null) {
      return;
    }
    const pixel = {x, y, color: currentColor}

    setNewPixels(m => {
      const n = new Map(m);
      n.set(getIndexByCoords(pixel.x, pixel.y, squaresPerPlate, width), pixel.color)
      return n;
    })
  }
  
  const handleMouseDown = (event) => {
    if(event.button !== 0) {
      return;
    }
    active.current = true;

    const {x, y} = getPixelCoords(event, pixelsPerSquare);
    if(x === null || y === null) {
      return;
    }

    const pixel = {x, y,  color: currentColor}

    setNewPixels(m => {
      const n = new Map();
      n.set(getIndexByCoords(pixel.x, pixel.y, squaresPerPlate, width), pixel.color)
      return n;
    })
  }

  const handleMouseUp = (event) => {
    active.current = false;

    // Notify the parent that we're done painting
    const updatedPixels = [...currentPixels];
    for(const [index, color] of newPixels.entries()) {
      updatedPixels[index] = color;
    }
    
    onNewPixels(updatedPixels);
  }

  return (
    <>
      <canvas
        width={pixelsPerSquare * squaresPerPlate * width - 1}
        height={pixelsPerSquare * squaresPerPlate * height - 1}
        style={{
          border: '1px solid #000'
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