import React from 'react';
import AppBar from './components/layout/AppBar';
import AppContainer from './components/layout/AppContainer';
import { UseWalletProvider } from 'use-wallet';

function App() {
  return (
    <UseWalletProvider>
      <AppBar />
      <AppContainer />
    </UseWalletProvider>
  );
}

export default App;
