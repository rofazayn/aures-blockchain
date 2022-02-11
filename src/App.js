import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Bank from './views/Bank';

function App() {
  return (
    <ChakraProvider>
      <Bank />
    </ChakraProvider>
  );
}

export default App;
