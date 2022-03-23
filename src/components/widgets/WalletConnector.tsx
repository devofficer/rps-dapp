import React, { useState } from 'react';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWallet } from 'use-wallet';
import WalletSelector from './WalletSelector';

const WalletConnector: React.FC = () => {
  const wallet = useWallet();
  const [open, setOpen] = useState<boolean>(false);

  const handleConnect = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectWallet = async (connectorId: string) => {
    await wallet.connect(connectorId);
    handleClose();
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
      <WalletSelector
        open={open}
        onClose={handleClose}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
};

export default WalletConnector;