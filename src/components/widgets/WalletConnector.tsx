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

  const handleDisconnect = (event: React.MouseEvent<HTMLElement>) => {
    wallet.reset();
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
      {wallet.status === 'connected' ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDisconnect}
          sx={{ textTransform: 'none' }}
        >
          {`${wallet.account?.slice(0, 6)}...${wallet.account?.slice(-5)}`}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AccountBalanceWalletIcon />}
          onClick={handleConnect}
        >
          Connect Wallet
        </Button>
      )}
      <WalletSelector
        open={open}
        onClose={handleClose}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
};

export default WalletConnector;