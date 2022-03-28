import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import { checkPlayer1Solved, player1Timeout } from 'utils/web3-helpers';
import ROUTES from 'config/routes';

const JoinedGame: React.FC = () => {
  const wallet = useWallet();
  const navigate = useNavigate();

  const { addr, timestamp } = useParams();
  const [player1Solved, setPlayer1Solved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [intervalId, setIntervalId] = useState<number>(0);
  const [player1Timeouted, setPlayer1Timeouted] = useState<boolean>(false);

  const handleTimer = useCallback(async () => {
    if (timestamp === 'timeouted') {
      setResult('You are refunded');
      clearInterval(intervalId);
      setIntervalId(0);
    }

    if (!player1Solved) {
      const solved = await checkPlayer1Solved({ wallet, gameContractAddr: addr as string });

      if (solved) {
        setResult('Game Over');
        clearInterval(intervalId);
        setIntervalId(0);
        setPlayer1Solved(true);
      }
    } else if (!player1Timeouted) {
      const currentTime = new Date().getTime();
      const delta = (currentTime - parseInt(timestamp as string)) / 1000 / 60 // to minutes;

      if (delta > 5) {
        setResult('Game creator seems to be not available. You will get refunded soon.');
        clearInterval(intervalId);
        setIntervalId(0);
        setPlayer1Timeouted(true);
        setLoading(true);

        const timeouted = await player1Timeout({ wallet, gameContractAddr: addr as string });

        if (timeouted) {
          setResult('You are refunded');
          setLoading(false);

          navigate(ROUTES.joined.path
            .replace(':addr', addr as string)
            .replace(':timestamp', 'timeouted')
          );
        }
      }
    }
    // eslint-disable-next-line
  }, [wallet, addr, timestamp, player1Timeouted]);

  useEffect(() => {
    if (wallet.status === 'connected') {
      const id = setInterval(handleTimer, 1000);
      setIntervalId(id as any);

      return () => {
        clearInterval(id);
        setIntervalId(0);
      };
    }
  }, [wallet, handleTimer]);

  return result ? (
    <Typography variant="h3">
      {result}
    </Typography>
  ) : wallet.status === 'connected' ? (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Created Game
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Game Contract: {addr}
      </Typography>

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </Box>
  ) : (
    <Typography variant="h5">
      Please connect your wallet
    </Typography>
  );
};

export default JoinedGame;
