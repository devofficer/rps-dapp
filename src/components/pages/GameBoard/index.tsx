import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useWallet } from 'use-wallet';
import { useNavigate } from 'react-router-dom';
import { Entropy, charset16 } from 'entropy-string';

import { Move } from 'config/rps';
import { createGameContract, getCommitment } from 'utils/web3-helpers';
import CreateGameDialog from './CreateGameDialog';
import ROUTES from 'config/routes';
import MoveSelector from 'components/widgets/MoveSelector';

const GameBoard: React.FC = () => {
  const wallet = useWallet();
  const navigate = useNavigate();

  const [movement, setMovement] = useState<Move>(Move.Null);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const salt = useRef(`0x${new Entropy({ charset: charset16, bits: 256 }).string()}`);
  const commitment = useRef('');

  const handleMovementChange = (
    event: React.MouseEvent<HTMLElement>,
    newMovement: Move,
  ) => {
    setMovement(newMovement);
  };

  const handleStartCreating = async (event: React.MouseEvent<HTMLElement>) => {
    commitment.current = await getCommitment({ wallet, movement, salt: salt.current });
    setCreateOpen(true);
  };

  const handleCreateGame = async (staking: string, player: string) => {
    setLoading(true);
    const address = await createGameContract({ wallet, staking, params: [commitment.current, player] });
    setLoading(false);
    setCreateOpen(false);

    if (address) {
      const timestamp = new Date().getTime().toString();
      localStorage.setItem(`${address}_salt`, salt.current.toString());
      localStorage.setItem(`${address}_movement`, movement.toString());

      navigate(ROUTES.created.path
        .replace(':addr', address)
        .replace(':timestamp', timestamp)
      );
    } else {
      alert('Failed to create game. Please try again considering options carefully');
    }
  };

  return wallet.status === 'connected' ? (
    <Box display="flex" flexDirection="column" minWidth={300}>
      <Typography variant="h6">
        Please select movement for winning game
      </Typography>
      <MoveSelector value={movement} onChange={handleMovementChange} />
      <Button
        variant="contained"
        color="success"
        size="large"
        sx={{ mb: 4 }}
        onClick={handleStartCreating}
        disabled={movement === Move.Null}
      >
        Create Game
      </Button>
      <CreateGameDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateGame}
      />
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

export default GameBoard;
