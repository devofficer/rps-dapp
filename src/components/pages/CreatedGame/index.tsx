import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useWallet } from 'use-wallet';
import { checkPlayerReacted, checkWinningStatus, getGameContractData, getStake, player2Timeout, solve } from 'utils/web3-helpers';
import { TIMEOUT } from 'config/contracts';
import { GameOverStatus, GAME_OVER_MESSAGES } from 'config/rps';

const CreatedGame: React.FC = () => {
  const wallet = useWallet();

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
  const [gameOverStatus, setGameOverStatus] = useState<GameOverStatus>(GameOverStatus.Null);
  const [intervalId, setIntervalId] = useState<number>(0);
  const [player2Timeouted, setPlayer2Timeouted] = useState<boolean>(false);

  const gameOver = (status: GameOverStatus) => {
    setGameOverStatus(status);
    clearInterval(intervalId);
    setIntervalId(0);
  };

  const handleTimer = useCallback(async () => {

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
          gameOver(winningStatus ? GameOverStatus.Winned : GameOverStatus.Defeated);
        }
      }
    }

    if (!player2Timeouted) {
      const currentTime = new Date().getTime();
      const delta = currentTime - parseInt(timestamp as string);

      if (delta > TIMEOUT) {
        const stake = await getStake({ wallet, gameContractAddr: addr as string });
        setPlayer2Timeouted(true);

        if (stake === '0') {
          gameOver(GameOverStatus.Refunded);
        } else {
          gameOver(GameOverStatus.Timeouted);
          setLoading(true);

          const timeouted = await player2Timeout({ wallet, gameContractAddr: addr as string });

          if (timeouted) {
            gameOver(GameOverStatus.Refunded);
            setLoading(false);
          }
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
      gameOver(GameOverStatus.Failed)
    } else {
      gameOver(win ? GameOverStatus.Winned : GameOverStatus.Defeated);
    }
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
      {gameOverStatus ? (
        <Typography variant="h3" >
          {GAME_OVER_MESSAGES[gameOverStatus]}
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
