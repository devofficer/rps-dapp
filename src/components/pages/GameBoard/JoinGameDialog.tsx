import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export type JoinGameDialogProps = {
  open: boolean;
  onClose: () => void;
  onJoin: (addr: string) => void;
};

const JoinGameDialog: React.FC<JoinGameDialogProps> = ({ open, onClose, onJoin }) => {
  const [contractAddr, setContractAddr] = useState<string>('');

  const handleJoin = () => {
    onJoin(contractAddr);
  };
  
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>
        Join Game
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Game Contract Address"
              placeholder="Enter contract address"
              type="string"
              value={contractAddr}
              onChange={e => setContractAddr(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleJoin}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default JoinGameDialog;