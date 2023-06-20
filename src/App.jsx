import { useState, useRef, useEffect } from 'react';
import { CirclePicker } from 'react-color';
import './App.css';
import Canvas from './Components/Canvas';
import { Button, ButtonGroup } from '@chakra-ui/react';

const SCALE = 10;
const SQUARE_SIZE = 16;

function App() {
  const [history, setHistory] = useState([[]]);
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
    setHistory([[]])
    setStepHistory(0)
  }

  return (
    <div className="App">
      <Canvas 
        currentPixels={history[stepHistory]}
        onNewPixels={handleNewPixels}
      />
      <div>
        history count: {history.length}
      </div>
      <div>
        <ButtonGroup>
          <Button onClick={handleUndo} isDisabled={history.length === 1 || stepHistory <= 0}>
            Undo
          </Button>
          <Button onClick={handleRedo} isDisabled={history.length === 1 || stepHistory === history.length - 1}>
            Redo
          </Button>
          <Button onClick={handleReset} isDisabled={history.length === 1}>
            Reset
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default App;
