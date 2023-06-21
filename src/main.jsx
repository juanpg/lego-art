import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import { LegoArtProvider } from './Context/LegoArtContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <LegoArtProvider>
        <App />
      </LegoArtProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
