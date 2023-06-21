import { Button, ButtonGroup, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, useDisclosure, IconButton } from '@chakra-ui/react';
import { useState, useContext, Fragment } from 'react';
import { CirclePicker } from 'react-color';
import { LuUndo2, LuRedo2, LuTrash2 } from 'react-icons/lu';
import './App.css';

import { LegoArtContext } from './Context/LegoArtContext';
import Canvas from './Components/Canvas';
import CanvasDimensions from './Components/CanvasDimensions';

function App() {
  const { dimensions, squaresPerPlate, colors, currentColor, onColorChange } = useContext(LegoArtContext);
  const { isOpen, onOpen, onClose: onChangeColorClose } = useDisclosure();

  const [history, setHistory] = useState([
    Array(dimensions.width * squaresPerPlate * dimensions.height * squaresPerPlate).fill(null)
  ]);
  const [stepHistory, setStepHistory] = useState(0);

  const handleNewPixels = (newPixels) => {
    setHistory([...history.slice(0, stepHistory + 1), newPixels]);
    setStepHistory(stepHistory+1)
  }

  const handleUndo = () => {
    setStepHistory(stepHistory - 1)
  }

  const handleRedo = () => {
    setStepHistory(stepHistory + 1)
  }

  const handleReset = () => {
    setHistory([
      Array(dimensions.width * squaresPerPlate * dimensions.height * squaresPerPlate).fill(null)
    ])
    setStepHistory(0)
  }

  const handleColorChange = (color) => {
    onColorChange(color.hex);
    onChangeColorClose();
  }

  return (
    <Fragment>
      <Canvas 
        width={dimensions.width}
        height={dimensions.height}
        currentPixels={history[stepHistory]}
        onNewPixels={handleNewPixels}
      />
      <CanvasDimensions 
        reset={handleReset}
      />
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onChangeColorClose}
      >
        <PopoverTrigger>
          <Button bg={currentColor} borderRadius={'50%'} size='xs'></Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverHeader>Change color</PopoverHeader>
          <PopoverBody p={4} gap={4} justifyContent='center' alignItems='center'>
            <CirclePicker
              color={currentColor}
              onChangeComplete={handleColorChange}
              colors={colors}
              width='252px'
              circleSize={28}
              circleSpacing={14}
            />
            <ButtonGroup>
              <Button>Add Color</Button>
              <Button>Remove Color</Button>
            </ButtonGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      
      <div>
        <ButtonGroup>
          <IconButton 
            onClick={handleUndo} 
            isDisabled={history.length === 1 || stepHistory <= 0}
            aria-label='Undo'
            icon={<LuUndo2 />}
          / >
          <IconButton 
            onClick={handleRedo} 
            isDisabled={history.length === 1 || stepHistory === history.length - 1} 
            aria-label='Redo'
            icon={<LuRedo2 />}
          />
          <IconButton 
            onClick={handleReset} 
            isDisabled={history.length === 1}
            aria-label='Reset'
            icon={<LuTrash2 />}
          />
        </ButtonGroup>
      </div>
    </Fragment>
  );
}

export default App;
