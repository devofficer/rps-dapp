import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { useWallet } from 'use-wallet';
import { useNavigate } from 'react-router-dom';
import { Entropy, charset16 } from 'entropy-string';

import { Move } from 'config/rps';
import { createGameContract, getCommitment } from 'utils/web3-helpers';
import ROUTES from 'config/routes';
import MoveSelector from 'components/widgets/MoveSelector';

const CreateGame: React.FC = () => {
  const wallet = useWallet();
  const navigate = useNavigate();

  const [movement, setMovement] = useState<Move>(Move.Null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stakingAmount, setStakingAmount] = useState<string>('0');
  const [player2Address, setPlayer2Address] = useState<string>('');

  useEffect(() => {
    if (wallet.account) {
      setPlayer2Address(wallet.account)
    }
  }, [wallet]);

  const handleMovementChange = (
    event: React.MouseEvent<HTMLElement>,
    newMovement: Move,
  ) => {
    setMovement(newMovement);
  };

  const handleCreateGame = async () => {
    setLoading(true);
    const salt = `0x${new Entropy({ charset: charset16, bits: 256 }).string()}`;
    const commitment = await getCommitment({ wallet, movement, salt });
    const address = await createGameContract({ wallet, staking: stakingAmount, params: [commitment, player2Address] });
    setLoading(false);

    if (address) {
      localStorage.setItem(`${address}_salt`, salt);
      localStorage.setItem(`${address}_movement`, movement.toString());

      navigate(ROUTES.created.path.replace(':addr', address));
    } else {
      alert('Failed to create game. Please try again considering options carefully');
    }
  };

  return wallet.status === 'connected' ? (
    <Box display="flex" flexDirection="column" minWidth={400}>
      <MoveSelector
        label="Movement"
        value={movement}
        onChange={handleMovementChange}
      />
      <TextField
        fullWidth
        label="Staking amount"
        placeholder="Enter the amount in ETH"
        type="number"
        value={stakingAmount}
        onChange={e => setStakingAmount(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Another Player Address"
        placeholder="Enter another player address"
        type="string"
        value={player2Address}
        onChange={e => setPlayer2Address(e.target.value)}
        sx={{ mb: 4 }}
      />
      <Button
        variant="contained"
        color="success"
        size="large"
        sx={{ mb: 4 }}
        onClick={handleCreateGame}
        disabled={movement === Move.Null || parseFloat(stakingAmount) === 0}
      >
        Create Game
      </Button>
      <Backdrop open={loading} sx={{ zIndex: 99999 }}>
        <CircularProgress />
      </Backdrop>
    </Box>
  ) : (
    <Typography variant="h5">
      Please connect your wallet
    </Typography>
  );
};

export default CreateGame;
