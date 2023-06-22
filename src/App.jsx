import { Box, ButtonGroup, Container, Flex, HStack, Heading, IconButton, Spacer, Stack, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { LuUndo2, LuRedo2, LuTrash2, LuMoon, LuSun } from 'react-icons/lu';
import './App.css';

import { LegoArtContext } from './Context/LegoArtContext';
import Canvas from './Components/Canvas';
import CanvasDimensions from './Components/CanvasDimensions';
import ColorPicker from './Components/ColorPicker';
import ToolPicker from './Components/ToolPicker';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { dimensions, squaresPerPlate } = useContext(LegoArtContext);
  const [history, setHistory] = useState([
    Array(dimensions.height * squaresPerPlate).fill(Array(dimensions.width * squaresPerPlate).fill(null))
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
      Array(dimensions.height * squaresPerPlate).fill(Array(dimensions.width * squaresPerPlate).fill(null))
    ])
    setStepHistory(0)
  }

  

  return (
    <Container maxW='container.lg' p={0}>
      <Flex h='100vh' py={5} mb={0}>
        <VStack w='full' h='full' px={5} py={5} spacing={10} alignItems='center'>
          <Box w='full'>
            <Box margin='0 auto'>
              <nav>
                <HStack 
                  justifyContent='space-between'
                  bg={useColorModeValue('gray.50', 'gray.900')}
                  py={2} px={4}
                >
                  <Heading fontSize='2xl'>Lego Art Maker</Heading>
                  <ButtonGroup>
                    <CanvasDimensions reset={handleReset} />
                    <IconButton
                      onClick={toggleColorMode}
                      title='Switch theme'
                      aria-label='Switch theme'
                      icon={ colorMode === 'light' ? <LuMoon /> : <LuSun /> }
                    />
                  </ButtonGroup>
                </HStack>
              </nav>
            </Box>
          </Box>
          <Box w='full'>
            <Box>
              <main>
                <Flex>
                  <Canvas 
                    currentPixels={history[stepHistory]}
                    onNewPixels={handleNewPixels}
                  />
                  <Spacer />
                  <Stack>
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
                      <Spacer />
                      <ColorPicker />
                      <ToolPicker />
                  </Stack>
                </Flex>
              </main>
            </Box>
          </Box>
          <ButtonGroup>
            
          </ButtonGroup>
        </VStack>
      </Flex>
    </Container>
  );
}

export default App;
