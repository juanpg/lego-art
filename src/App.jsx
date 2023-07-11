import { Box, ButtonGroup, Container, Divider, Flex, HStack, Heading, IconButton, Spacer, Stack, VStack, useColorMode, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
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
import { useWindowWidth } from './Hooks/useWindowWidth';

function App() {
  const emptyHistory = (w, h) => {
    return [Array(h * squaresPerPlate).fill(null).map( () => Array(w * squaresPerPlate).fill(null))]
  }

  const { colorMode, toggleColorMode } = useColorMode();
  const { dimensions, onDimensionsChange, squaresPerPlate } = useContext(LegoArtContext);
  const [width, height] = dimensions;
  const [history, setHistory] = useState(() => emptyHistory(width, height));
  const [stepHistory, setStepHistory] = useState(0);
  const windowWidth = useWindowWidth();

  // useEffect(() => {
  //   setHistory(emptyHistory())
  //   setStepHistory(0)
  // }, [dimensions])

  const handleNewPixels = (newPixels) => {
    setHistory([...history.slice(0, stepHistory + 1), newPixels]);
    setStepHistory(stepHistory+1)
  }

  const handleLoadImage = (newWidth, newHeight, newPixels) => {
    if(dimensions[0] !== newWidth || dimensions[1] !== newHeight) {
      onDimensionsChange(newWidth, newHeight);
      setHistory(h => newPixels ? [newPixels] : emptyHistory(newWidth, newHeight))
      setStepHistory(sh => 0)
    } else {
      setHistory(h => [...h.slice(0, stepHistory + 1), newPixels]);
      setStepHistory(sh => sh+1)
    }
  }

  const handleUndo = () => {
    setStepHistory(stepHistory - 1)
  }

  const handleRedo = () => {
    setStepHistory(stepHistory + 1)
  }

  const handleReset = () => {
    setHistory(emptyHistory(width, height))
    setStepHistory(0)
  }

  const buttonProps = {
    fontSize: useBreakpointValue({ base: 'unset', md: '20px' }),
    size: useBreakpointValue({ base: 'sm', md: 'md' })
  }

  return (
    <Container minW='320px' maxW='container.lg' p={0}>
      <Flex h='100vh' py={5} mb={0}>
        <VStack w='full' h='full' px={5} py={5} spacing={10} alignItems='center'>
          <Box w='full'>
            <Box margin='0 auto' as='header'>
              <HStack 
                justifyContent='space-between'
                bg={useColorModeValue('gray.50', 'gray.900')}
                py={2} px={4}
              >
                <Heading fontSize={useBreakpointValue({base: 'lg', md: '2xl'})}>Lego Art Maker</Heading>
                <ButtonGroup>
                  <IconButton
                    onClick={toggleColorMode}
                    title='Switch theme'
                    aria-label='Switch theme'
                    icon={ colorMode === 'light' ? <LuMoon /> : <LuSun /> }
                    color={ useColorModeValue('darkblue', 'yellow') }
                    {...buttonProps}
                  />
                </ButtonGroup>
              </HStack>
            </Box>
          </Box>
          <Box w='full'>
            <Box margin='0 auto' as='nav'>
              <Stack
                // justifyContent='space-between'
                bg={useColorModeValue('gray.50', 'gray.900')}
                p={3}
                direction={windowWidth < 320 ? 'column' : 'row'}
              >
                <ButtonGroup>
                  <FileNew onLoadImage={handleLoadImage} {...buttonProps} />
                  <FileLoad onLoadImage={handleLoadImage} {...buttonProps} />
                  <FileSave pixels={history[stepHistory]} {...buttonProps} />
                </ButtonGroup>
                <ButtonGroup>
                  <IconButton 
                    onClick={handleUndo} 
                    isDisabled={history.length === 1 || stepHistory <= 0}
                    aria-label='Undo'
                    title='Undo'
                    icon={<LuUndo2 />}
                    {...buttonProps}
                  />
                  <IconButton 
                    onClick={handleRedo} 
                    isDisabled={history.length === 1 || stepHistory === history.length - 1} 
                    aria-label='Redo'
                    title='Redo'
                    icon={<LuRedo2 />}
                    {...buttonProps}
                  />
                  <IconButton 
                    onClick={handleReset} 
                    isDisabled={history.length === 1}
                    aria-label='Clear history'
                    title='Clear history'
                    icon={<LuTrash2 />}
                    {...buttonProps}
                  />
                </ButtonGroup>
              </Stack>
            </Box>
          </Box>
          <Box w='full'>
            <Box>
              <main>
                <Flex justify='space-evenly' direction={((windowWidth < 400) || (dimensions[0] > dimensions[1])) ? 'column' : 'row'} gap={3} mb={3}>
                  <Canvas 
                    currentPixels={history[stepHistory]}
                    onNewPixels={handleNewPixels}
                  />
                  <Stack direction={((windowWidth < 320) || (dimensions[0] > dimensions[1])) ? 'row' : 'column'}>
                      <ColorPicker width='3rem' {...buttonProps} />
                      <ToolPicker width='3rem' {...buttonProps} />
                      <Stats pixels={history[stepHistory]} width='3rem' {...buttonProps} />
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
