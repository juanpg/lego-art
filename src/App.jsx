import { ButtonGroup, Container, Flex, IconButton } from '@chakra-ui/react';
import { useState, useContext, Fragment } from 'react';
import { LuUndo2, LuRedo2, LuTrash2 } from 'react-icons/lu';
import './App.css';

import { LegoArtContext } from './Context/LegoArtContext';
import Canvas from './Components/Canvas';
import CanvasDimensions from './Components/CanvasDimensions';
import ColorPicker from './Components/ColorPicker';

function App() {
  const { dimensions, squaresPerPlate } = useContext(LegoArtContext);
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

  

  return (
    <Container
      p={5}
    >
      <Canvas 
        width={dimensions.width}
        height={dimensions.height}
        currentPixels={history[stepHistory]}
        onNewPixels={handleNewPixels}
      />
      <Flex gap={3} align='center'>
        <CanvasDimensions 
          reset={handleReset}
        />
        <ColorPicker />
      </Flex>
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
    </Container>
  );
}

export default App;
