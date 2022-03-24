import React from 'react';
import AppBar from './components/layout/AppBar';
import AppContainer from './components/layout/AppContainer';
import GameBoard from 'components/widgets/GameBoard';
import { UseWalletProvider } from 'use-wallet';

function App() {
  return (
    <UseWalletProvider>
      <AppBar />
      <AppContainer>
        <GameBoard />
      </AppContainer>
    </UseWalletProvider>
  );
}

export default App;
