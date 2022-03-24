import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import wallets from 'config/wallets';
import makeStyles from '@mui/styles/makeStyles';

type WalletSelectorProps = {
  open: boolean;
  onSelectWallet: (wallet: string) => void;
  onClose: () => void;
};

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: theme.spacing(2),
    minWidth: 250,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'none',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: theme.spacing(1, 5),
  }
}));

const WalletSelector: React.FC<WalletSelectorProps> = ({ open, onSelectWallet, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Connect Your Wallet
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          {wallets.map((wallet, idx) => (
            <Button
              key={idx}
              variant="outlined"
              fullWidth
              color="secondary"
              className={classes.button}
              onClick={() => onSelectWallet(wallet.id)}
            >
              {wallet.title}
              <wallet.icon fontSize="large" />
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default WalletSelector;