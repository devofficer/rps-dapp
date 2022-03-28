import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export type CreateGameDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (staking: string, player: string) => void;
};

const CreateGameDialog: React.FC<CreateGameDialogProps> = ({ open, onClose, onCreate }) => {
  const [stakingAmount, setStakingAmount] = useState<string>('');
  const [playerAddress, setPlayerAddress] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const handleCreate = async () => {
    setCreating(true);
    await onCreate(stakingAmount, playerAddress);
    setCreating(false);
  };
  
  return (
    <Dialog open={open}>
      <DialogTitle>
        Create Game
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Staking amount"
              placeholder="Enter the amount in ETH"
              type="number"
              value={stakingAmount}
              onChange={e => setStakingAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Another Player Address"
              placeholder="Enter another player address"
              type="string"
              value={playerAddress}
              onChange={e => setPlayerAddress(e.target.value)}
            />
          </Grid>
        </Grid>
        <Backdrop open={creating}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default CreateGameDialog;