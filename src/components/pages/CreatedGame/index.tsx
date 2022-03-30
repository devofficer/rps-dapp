import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Link from '@mui/material/Link';

import { useWallet } from 'use-wallet';
import { checkPlayerReacted, checkWinningStatus, getGameContractData, getStake, player2Timeout, solve } from 'utils/web3-helpers';
import { TIMEOUT } from 'config/contracts';
import { GameOverStatus, GAME_OVER_MESSAGES } from 'config/rps';
import ROUTES from 'config/routes';

const CreatedGame: React.FC = () => {
  const wallet = useWallet();

  const { addr, timestamp } = useParams();
  const gameContractAddr = addr as string;

  useEffect(() => {
    (async () => {
      if (wallet.status === 'connected') {
        const { player2 } = await getGameContractData({ wallet, gameContractAddr });
        const salt = localStorage.getItem(`${gameContractAddr}_salt`) as string;
        const movement = localStorage.getItem(`${gameContractAddr}_movement`) as string;
        setGameInfo({ salt, movement, player2 });
      }
    })();
  }, [wallet, gameContractAddr]);

  const [{ salt, movement }, setGameInfo] = useState<{
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
    localStorage.removeItem(`${gameContractAddr}_salt`);
    localStorage.removeItem(`${gameContractAddr}_movement`);
  };

  const handleTimer = useCallback(async () => {

    if (!player2Confirmed) {
      const confirmed = await checkPlayerReacted({ wallet, gameContractAddr });

      if (confirmed) {
        const winningStatus = await checkWinningStatus({
          wallet,
          gameContractAddr,
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
        const stake = await getStake({ wallet, gameContractAddr });
        setPlayer2Timeouted(true);

        if (stake === '0') {
          gameOver(GameOverStatus.Refunded);
        } else {
          gameOver(GameOverStatus.Timeouted);
          setLoading(true);

          const timeouted = await player2Timeout({ wallet, gameContractAddr });

          if (timeouted) {
            gameOver(GameOverStatus.Refunded);
            setLoading(false);
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [wallet, gameContractAddr, salt, movement, timestamp, player2Timeouted]);

  const handleSolve = async () => {
    setLoading(true);
    const win = await solve({
      wallet,
      gameContractAddr,
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
      <Backdrop open={loading} sx={{ zIndex: 999999 }}>
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
          <Typography variant="h5" sx={{ mb: 1 }}>
            Game link for other player to join
          </Typography>
          <Typography variant="h5" sx={{ mb: 5 }}>
            <Link href={ROUTES.join.path.replace(':addr', gameContractAddr)} target="_blank">
              {`${window.location.host}${ROUTES.join.path.replace(':addr', gameContractAddr)}`}
            </Link>
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
