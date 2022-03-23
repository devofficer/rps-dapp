import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import wallets from 'config/wallets';
import { blue } from '@mui/material/colors';

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
      <DialogContent sx={{ px: 0 }}>
        <List>
          {wallets.map(wallet => (
            <ListItem
              button
              secondaryAction={
                <Box display="flex" alignItems="center">
                  <wallet.icon fontSize="large" />
                </Box>
              }
              sx={{ minWidth: 300 }}
            >
              <ListItemText
                primary={wallet.title}
                sx={{ color: blue[800], fontWeight: 'bold' }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default WalletSelector;