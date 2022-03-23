import React from 'react';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWallet } from 'use-wallet';

const WalletConnector: React.FC = () => {
  const wallet = useWallet();

  const handleConnect = async (event: React.MouseEvent<HTMLElement>) => {
    await wallet.connect('injected');
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AccountBalanceWalletIcon />}
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    </>
  );
};

export default WalletConnector;