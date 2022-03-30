import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useWallet } from 'use-wallet';
import { checkPlayerReacted, checkWinningStatus, getGameContractData, player2Timeout, solve } from 'utils/web3-helpers';
import ROUTES from 'config/routes';
import { TIMEOUT } from 'config/contracts';

const CreatedGame: React.FC = () => {
  const wallet = useWallet();
  const navigate = useNavigate();

  const { addr, timestamp } = useParams();

  useEffect(() => {
    (async () => {
      if (wallet.status === 'connected') {
        const { player2 } = await getGameContractData({ wallet, gameContractAddr: addr as string });
        const salt = localStorage.getItem(`${addr}_salt`) as string;
        const movement = localStorage.getItem(`${addr}_movement`) as string;
        setGameInfo({ salt, movement, player2 });
      }
    })();
  }, [wallet, addr]);

  const [{ salt, movement, player2 }, setGameInfo] = useState<{
    salt: string,
    movement: string,
    player2: string
  }>({
    salt: '',
    movement: '',
    player2: ''
  });
  const [player2Confirmed, setPlayer2Confirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [intervalId, setIntervalId] = useState<number>(0);
  const [player2Timeouted, setPlayer2Timeouted] = useState<boolean>(false);

  const handleTimer = useCallback(async () => {
    if (timestamp === 'timeouted') {
      setResult('You are refunded');
      clearInterval(intervalId);
      setIntervalId(0);
    }

    if (!player2Confirmed) {
      const confirmed = await checkPlayerReacted({ wallet, gameContractAddr: addr as string });

      if (confirmed) {
        const winningStatus = await checkWinningStatus({
          wallet,
          gameContractAddr: addr as string,
          salt: salt,
          movement: movement
        });

        if (winningStatus === null) {
          setPlayer2Confirmed(true);
        } else {
          setResult(winningStatus ? 'Congratulations!!! You are winner!' : 'Sorry...you are defeated!');
          clearInterval(intervalId);
          setIntervalId(0);
        }
      }
    } else if (!player2Timeouted) {
      const currentTime = new Date().getTime();
      const delta = currentTime - parseInt(timestamp as string);

      if (delta > TIMEOUT) {
        setResult('Your player seems to be not available. You will get refunded soon.');
        clearInterval(intervalId);
        setIntervalId(0);
        setPlayer2Timeouted(true);
        setLoading(true);

        const timeouted = await player2Timeout({ wallet, gameContractAddr: addr as string });

        if (timeouted) {
          setResult('You are refunded');
          setLoading(false);

          navigate(ROUTES.created.path
            .replace(':addr', addr as string)
            .replace(':timestamp', 'timeouted')
          );
        }
      }
    }
    // eslint-disable-next-line
  }, [wallet, addr, salt, movement, timestamp, player2Timeouted]);

  const handleSolve = async () => {
    setLoading(true);
    const win = await solve({
      wallet,
      gameContractAddr: addr as string,
      salt: salt,
      movement: movement
    });
    setLoading(false);

    if (win === null) {
      setResult('Oops...invalid parameters are detected!')
    } else {
      setResult(win ? 'Congratulations!!! You are winner!' : 'Sorry...you are defeated!');
    }

    clearInterval(intervalId);
    setIntervalId(0);
  };

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

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
      {result ? (
        <Typography variant="h3" >
          {result}
        </Typography >
      ) : wallet.status === 'connected' ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Created Game
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Game Contract: {addr}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Player: {player2}
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <Button
              variant="contained"
              disabled={!player2Confirmed}
              color="primary"
              sx={{ width: 200, height: 50 }}
              onClick={handleSolve}
            >
              Solve
            </Button>
            {!player2Confirmed && (
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
        </Box>
      ) : (
        <Typography variant="h5">
          Please connect your wallet
        </Typography>
      )}
    </>
  );
};

export default CreatedGame;
