import { useEffect, useRef, useState } from "react";

const SCALE = 20;

export default function Canvas({currentPixels, onNewPixels }) {
  const canvasRef = useRef(null);
  const active = useRef(false);
  const [newPixels, setNewPixels] = useState([])

  if(canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    currentPixels.forEach(({x, y, color}) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    });
  }

  useEffect(() => {
    if(canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      newPixels.forEach(({x, y, color}) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
      }) 
    }
  }, [newPixels])

  const handleMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    const pixel = {x: Math.floor((event.clientX - rect.left) / SCALE), y: Math.floor((event.clientY - rect.top) / SCALE), color: '#000000'}

    if(!active.current) {
      return;
    }

    setNewPixels([...newPixels, pixel])
  }
  
  const handleMouseDown = (event) => {
    if(event.button !== 0) {
      return;
    }
    active.current = true;
    const rect = event.target.getBoundingClientRect();
    const pixel = {x: Math.floor((event.clientX - rect.left) / SCALE), y: Math.floor((event.clientY - rect.top) / SCALE), color: '#000000'}
    setNewPixels([pixel])
  }

  const handleMouseUp = (event) => {
    active.current = false;

    // Notify the parent that we're done painting
    onNewPixels([...currentPixels, ...newPixels])
  }

  return (
    <canvas
      width='400px'
      height='400px'
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMove}
    >
    </canvas>
  )
}