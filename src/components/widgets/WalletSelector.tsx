import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

type WalletSelectorProps = {
  open: boolean;
  onSelectWallet: (wallet: string) => void;
  onClose: () => void;
};

const WalletSelector: React.FC<WalletSelectorProps> = ({ open, onSelectWallet, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Connect Your Wallet
      </DialogTitle>
      <DialogContent>
        <List>
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default WalletSelector;