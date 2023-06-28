import { Box, ButtonGroup, Container, Divider, Flex, HStack, Heading, IconButton, Spacer, Stack, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';
import { LuUndo2, LuRedo2, LuTrash2, LuMoon, LuSun } from 'react-icons/lu';
import './App.css';

import { LegoArtContext } from './Context/LegoArtContext';
import Canvas from './Components/Canvas';
import CanvasDimensions from './Components/CanvasDimensions';
import ColorPicker from './Components/ColorPicker';
import ToolPicker from './Components/ToolPicker';
import FileNew from './Components/FileNew';
import FileLoad from './Components/FileLoad';
import FileSave from './Components/FileSave';
import Stats from './Components/Stats';

function App() {
  const emptyHistory = () => {
    return [Array(height * squaresPerPlate).fill(Array(width * squaresPerPlate).fill(null))]
  }

  const { colorMode, toggleColorMode } = useColorMode();
  const { dimensions, squaresPerPlate } = useContext(LegoArtContext);
  const [width, height] = dimensions;
  const [history, setHistory] = useState(() => emptyHistory());
  const [stepHistory, setStepHistory] = useState(0);

  useEffect(() => {
    setHistory(emptyHistory())
    setStepHistory(0)
  }, [dimensions])

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
    setHistory(emptyHistory())
    setStepHistory(0)
  }

  return (
    <Container maxW='container.lg' p={0}>
      <Flex h='100vh' py={5} mb={0}>
        <VStack w='full' h='full' px={5} py={5} spacing={10} alignItems='center'>
          <Box w='full'>
            <Box margin='0 auto' as='header'>
              <HStack 
                justifyContent='space-between'
                bg={useColorModeValue('gray.50', 'gray.900')}
                py={2} px={4}
              >
                <Heading fontSize='2xl'>Lego Art Maker</Heading>
                <ButtonGroup>
                  <IconButton
                    onClick={toggleColorMode}
                    title='Switch theme'
                    aria-label='Switch theme'
                    icon={ colorMode === 'light' ? <LuMoon /> : <LuSun /> }
                    fontSize='24px'
                    color={ useColorModeValue('darkblue', 'yellow') }
                  />
                </ButtonGroup>
              </HStack>
            </Box>
          </Box>
          <Box w='full'>
            <Box margin='0 auto' as='nav'>
              <HStack
                justifyContent='space-between'
                bg={useColorModeValue('gray.50', 'gray.900')}
                py={2} px={4}
              >
                <ButtonGroup>
                  <FileNew />
                  <FileLoad />
                  <FileSave />
                  <Spacer />
                  <IconButton 
                    onClick={handleUndo} 
                    isDisabled={history.length === 1 || stepHistory <= 0}
                    aria-label='Undo'
                    title='Undo'
                    icon={<LuUndo2 />}
                    fontSize='24px'
                  />
                  <IconButton 
                    onClick={handleRedo} 
                    isDisabled={history.length === 1 || stepHistory === history.length - 1} 
                    aria-label='Redo'
                    title='Redo'
                    icon={<LuRedo2 />}
                    fontSize='24px'
                  />
                  <IconButton 
                    onClick={handleReset} 
                    isDisabled={history.length === 1}
                    aria-label='Clear history'
                    title='Clear history'
                    fontSize='24px'
                    icon={<LuTrash2 />}
                  />
                </ButtonGroup>
              </HStack>
            </Box>
          </Box>
          <Box w='full'>
            <Box>
              <main>
                <Flex justify='space-evenly'>
                  <Canvas 
                    currentPixels={history[stepHistory]}
                    onNewPixels={handleNewPixels}
                  />
                  <Stack>
                      <ColorPicker />
                      <ToolPicker />
                      <Stats pixels={history[stepHistory]} />
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
