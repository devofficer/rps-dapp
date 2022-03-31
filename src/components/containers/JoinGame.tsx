import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useWallet } from 'use-wallet';
import { useNavigate, useParams } from 'react-router-dom';

import { Move } from 'config/rps';
import { joinGame } from 'utils/web3-helpers';
import ROUTES from 'config/routes';
import MoveSelector from 'components/widgets/MoveSelector';

const JoinGame: React.FC = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const { addr } = useParams();
  const gameContractAddr = addr as string;

  const [movement, setMovement] = useState<Move>(Move.Null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleMovementChange = (
    event: React.MouseEvent<HTMLElement>,
    newMovement: Move,
  ) => {
    setMovement(newMovement);
  };

  const handleJoinGame = async () => {
    setLoading(true);
    const joined = await joinGame({ wallet, gameContractAddr, movement });
    setLoading(false);

    if (joined) {
      navigate(ROUTES.joined.path.replace(':addr', gameContractAddr));
    } else {
      alert('Failed to join game. Please try again considering options carefully');
    }
  };

  return wallet.status === 'connected' ? (
    <Box display="flex" flexDirection="column" minWidth={300}>
      <MoveSelector
        label="Movement"
        value={movement}
        onChange={handleMovementChange}
      />
      <Button
        variant="contained"
        color="warning"
        size="large"
        onClick={handleJoinGame}
        disabled={movement === Move.Null}
      >
        Join Game
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

export default JoinGame;
