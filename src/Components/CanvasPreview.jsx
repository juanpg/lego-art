import { useEffect, useRef, useContext } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { LegoArtContext } from "../Context/LegoArtContext";

export default function CanvasPreview({pixels, width, height}) {
  const canvasRef = useRef(null);
  const { drawPixel } = useContext(LegoArtContext);

  useEffect(() => {
    if(canvasRef.current && pixels) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      ctx.globalCompositeOperation = 'destination-under';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      pixels.forEach((row, y) => {
        row.forEach((color, x) => {
          drawPixel(ctx, {x, y, color})
        })
      });
    }
  }, [canvasRef, pixels])

  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        borderWidth: '5px',
        borderStyle: 'solid',
        borderRadius: '5px',
        borderColor: useColorModeValue('gray.400', 'whiteAlpha.800'),
      }}
    ></canvas>
  )
}