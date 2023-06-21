import { useContext, useEffect, useRef, useState } from "react";
import { LegoArtContext } from "../Context/LegoArtContext";

const drawPixel = (ctx, {x, y, color}, pixelSize) => {
  ctx.fillStyle = color ?? '#FFFFFF';
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

const getPixelCoords = (event, pixelSize) => {
  const rect = event.target.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / pixelSize);
  const y = Math.floor((event.clientY - rect.top) / pixelSize);

  return {x, y};
}

const getCoordsByIndex = (index, squareSize) => {
  const x = Math.floor(index / squareSize);
  const y = index - x * squareSize;
  return {x, y}
}

const getIndexByCoords = (x, y, squareSize) => {
  return x * squareSize + y;
}

export default function Canvas({width, height, currentPixels, onNewPixels }) {
  const canvasRef = useRef(null);
  const active = useRef(false);
  const [newPixels, setNewPixels] = useState(new Map)
  const { currentColor, squareSize, pixelSize } = useContext(LegoArtContext);
  
  if(canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    currentPixels.forEach((color, index) => {
      const {x, y} = getCoordsByIndex(index, squareSize);
      drawPixel(ctx, {x, y, color}, pixelSize)
    });
  }

  useEffect(() => {
    if(canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      for(const [index, color] of newPixels.entries()) {
        const {x, y} = getCoordsByIndex(index, squareSize);
        drawPixel(ctx, {x, y, color}, pixelSize)
      }
    }
  }, [newPixels])

  const handleMove = (event) => {
    if(!active.current) {
      return;
    }

    const {x, y} = getPixelCoords(event, pixelSize);

    const pixel = {x, y, color: currentColor}

    setNewPixels(m => {
      const n = new Map(m);
      n.set(getIndexByCoords(pixel.x, pixel.y, squareSize), pixel.color)
      return n;
    })
  }
  
  const handleMouseDown = (event) => {
    if(event.button !== 0) {
      return;
    }
    active.current = true;
    
    const {x, y} = getPixelCoords(event, pixelSize);

    const pixel = {x, y,  color: currentColor}

    setNewPixels(m => {
      const n = new Map();
      n.set(getIndexByCoords(pixel.x, pixel.y, squareSize), pixel.color)
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
        width={pixelSize * squareSize * width}
        height={pixelSize * squareSize * height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMove}
      >
      </canvas>
    </>
  )
}