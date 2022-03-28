import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useWallet } from 'use-wallet';
import { useNavigate } from 'react-router-dom';

import { RPS_MOVEMENTS, Move } from 'config/rps';
import { createGameContract, getCommitment } from './helpers';
import CreateGameDialog from './CreateGameDialog';
import ROUTES from 'config/routes';

const GameBoard: React.FC = () => {
  const wallet = useWallet();
  const navigate = useNavigate();

  const [movement, setMovement] = useState<Move>(Move.Null);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [creatingGame, setCreatingGame] = useState<boolean>(false);

  const salt = useRef(Math.floor(Math.random() * 10000));
  const commitment = useRef('');

  const handleMovementChange = (
    event: React.MouseEvent<HTMLElement>,
    newMovement: Move,
  ) => {
    setMovement(newMovement);
  };

  const handleCreateGame = async (event: React.MouseEvent<HTMLElement>) => {
    commitment.current = await getCommitment({ wallet, movement, salt: salt.current });
    setCreateOpen(true);
  };

  const handleCreatedGame = async (staking: string, player: string) => {
    setCreatingGame(true);
    const address = await createGameContract({ wallet, staking, params: [commitment.current, player] });
    setCreatingGame(false);
    
    if (address) {
      navigate(ROUTES.created.path.replace(':addr', address));
    } else {
      alert('Failed to create game. Please try again considering options carefully');
    }
  };

  const handleJoinGame = (event: React.MouseEvent<HTMLElement>) => {

  };

  if (wallet.status !== 'connected') {
    return (
      <Typography variant="h5">
        Please connect your wallet
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minWidth={300}>
      <Typography variant="h6">
        Please select movement for winning game
      </Typography>
      <ToggleButtonGroup
        sx={{ mb: 4 }}
        value={movement}
        onChange={handleMovementChange}
        exclusive
        color="primary"
      >
        {RPS_MOVEMENTS.map((action) => (
          <ToggleButton key={action.move} value={action.move}>
            {action.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Button
        variant="contained"
        color="success"
        size="large"
        sx={{ mb: 4 }}
        onClick={handleCreateGame}
        disabled={movement === Move.Null}
      >
        Create Game
      </Button>
      <Button
        variant="contained"
        color="warning"
        size="large"
        onClick={handleJoinGame}
        disabled={movement === Move.Null}
      >
        Join Game
      </Button>
      <CreateGameDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreatedGame}
      />
      <Backdrop open={creatingGame} sx={{ zIndex: 99999 }}>
        <CircularProgress />
      </Backdrop>
    </Box>
  )
};

export default GameBoard;
