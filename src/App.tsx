import React from 'react';
import AppBar from './components/layout/AppBar';
import AppContainer from './components/layout/AppContainer';
import AppContent from 'components/layout/AppContent';
import { UseWalletProvider } from 'use-wallet';
import Router from './Router';

function App() {
  return (
    <UseWalletProvider>
      <AppContainer>
        <AppBar />
        <AppContent>
          <Router />
        </AppContent>
      </AppContainer>
    </UseWalletProvider>
  );
}

export default App;
