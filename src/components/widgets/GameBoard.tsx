import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useWallet } from 'use-wallet';
import rps, { Move } from 'config/rps';

const GameBoard: React.FC = () => {
  const wallet = useWallet();
  const [movement, setMovement] = useState<Move>(Move.Null);

  const handleMovementChange = (
    event: React.MouseEvent<HTMLElement>,
    newMovement: Move,
  ) => {
    setMovement(newMovement);
  };

  const handleCreateGame = (event: React.MouseEvent<HTMLElement>) => {

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
        {rps.map((action) => (
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
    </Box>
  )
};

export default GameBoard;
