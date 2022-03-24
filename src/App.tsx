import React from 'react';
import AppBar from './components/layout/AppBar';
import AppContainer from './components/layout/AppContainer';
import GameBoard from 'components/widgets/GameBoard';
import AppContent from 'components/layout/AppContent';
import { UseWalletProvider } from 'use-wallet';

function App() {
  return (
    <UseWalletProvider>
      <AppContainer>
        <AppBar />
        <AppContent>
          <GameBoard />
        </AppContent>
      </AppContainer>
    </UseWalletProvider>
  );
}

export default App;
