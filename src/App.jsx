import { Button, ButtonGroup, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, useDisclosure, IconButton, NumberInput, FormControl, FormLabel, Flex, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Stack } from '@chakra-ui/react';
import { useState, useContext, Fragment } from 'react';
import { CirclePicker } from 'react-color';
import { LuUndo2, LuRedo2, LuTrash2 } from 'react-icons/lu';
import './App.css';

import { LegoArtContext } from './Context/LegoArtContext';
import Canvas from './Components/Canvas';

function App() {
  const { dimensions, squareSize, colors, currentColor, onColorChange } = useContext(LegoArtContext);
  const { isOpen, onOpen, onClose: onChangeColorClose } = useDisclosure();

  const [history, setHistory] = useState([
    Array(dimensions.width * squareSize * dimensions.height * squareSize).fill(null)
  ]);
  const [stepHistory, setStepHistory] = useState(0);
  const [width, setWidth] = useState(dimensions.width);
  const [height, setHeight] = useState(dimensions.height);

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
      Array(dimensions.width * squareSize * dimensions.height * squareSize).fill(null)
    ])
    setStepHistory(0)
  }

  const handleColorChange = (color, event) => {
    onColorChange(color.hex);
    onChangeColorClose();
  }

  const handleWidthChange = (_, value) => {
    setWidth(value);
    handleReset();
  }

  const handleHeightChange = (_, value) => {
    setHeight(value);
    handleReset();
  }

  return (
    <Fragment>
      <Canvas 
        width={width}
        height={height}
        currentPixels={history[stepHistory]}
        onNewPixels={handleNewPixels}
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
          <PopoverContent p={4} gap={4} justifyContent='center' alignItems='center'>
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
          </PopoverContent>
        </PopoverContent>
      </Popover>
      <div>
        <Flex>
          <FormControl w='100px'>
            <FormLabel>Width: </FormLabel>
            <NumberInput
              defaultValue={width}
              min={1}
              max={5}
              onChange={handleWidthChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl w='100px'>
            <FormLabel>Height: </FormLabel>
            <NumberInput
              defaultValue={height}
              min={1}
              max={5}
              onChange={handleHeightChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Flex>
      </div>
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
