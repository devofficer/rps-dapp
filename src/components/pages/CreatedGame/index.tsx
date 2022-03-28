import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useWallet } from 'use-wallet';
import { checkPlayerReacted, checkWinningStatus, solve } from 'utils/web3-helpers';

const CreatedGame: React.FC = () => {
  const wallet = useWallet();
  const { addr, player, salt, movement } = useParams();
  const [playerConfirmed, setPlayerConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const handleTimer = useCallback(async () => {
    const confirmed = await checkPlayerReacted({ wallet, gameContractAddr: addr as string });

    if (parseInt(confirmed)) {
      const winningStatus = await checkWinningStatus({
        wallet,
        gameContractAddr: addr as string,
        salt: salt as string,
        movement: movement as string
      });

      if (winningStatus === null) {
        setPlayerConfirmed(true);
      } else {
        setResult(winningStatus ? 'Congratulations!!! You are winner!' : 'Sorry...you are defeated!');
      }
    }
  }, [wallet, addr]);

  const handleSolve = async () => {
    setLoading(true);
    const win = await solve({
      wallet,
      gameContractAddr: addr as string,
      salt: salt as string,
      movement: movement as string
    });
    setLoading(false);

    if (win === null) {
      setResult('Oops...invalid parameters are detected!')
    } else {
      setResult(win ? 'Congratulations!!! You are winner!' : 'Sorry...you are defeated!');
    }
  };

  useEffect(() => {
    if (wallet.status === 'connected') {
      const intervalId = setInterval(handleTimer, 1000);
      return () => clearInterval(intervalId);
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
      <Typography variant="h5" sx={{ mb: 4 }}>
        Player: {player}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Button
          variant="contained"
          disabled={!playerConfirmed}
          color="primary"
          sx={{ width: 200, height: 50 }}
          onClick={handleSolve}
        >
          Solve
        </Button>
        {!playerConfirmed && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
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

export default CreatedGame;
