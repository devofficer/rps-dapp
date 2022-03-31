import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import { useWallet } from 'use-wallet';
import { checkPlayer1Solved, getGameContractData, getStake, player1Timeout } from 'utils/web3-helpers';
import { TIMEOUT } from 'config/contracts';
import { GameOverStatus, GAME_OVER_MESSAGES } from 'config/rps';

const JoinedGame: React.FC = () => {
  const wallet = useWallet();

  const { addr } = useParams();
  const gameContractAddr = addr as string;

  useEffect(() => {
    (async () => {
      if (wallet.status === 'connected') {
        const { lastAction } = await getGameContractData({ wallet, gameContractAddr });
        setLastAction(parseInt(lastAction) * 1000);
      }
    })();
  }, [wallet, gameContractAddr]);

  const [lastAction, setLastAction] = useState<number>(0);
  const [gameOverStatus, setGameOverStatus] = useState<GameOverStatus>(GameOverStatus.Null);
  const [intervalId, setIntervalId] = useState<number>(0);
  const [player1Solved, setPlayer1Solved] = useState<boolean>(false);
  const [player1Timeouted, setPlayer1Timeouted] = useState<boolean>(false);

  const gameOver = (status: GameOverStatus) => {
    setGameOverStatus(status);
    clearInterval(intervalId);
    setIntervalId(0);
  };

  const handleTimer = useCallback(async () => {
    if (!player1Solved) {
      const solved = await checkPlayer1Solved({ wallet, gameContractAddr });

      if (solved) {
        gameOver(GameOverStatus.GameOver);
        setPlayer1Solved(true);
      } else if (!player1Timeouted && lastAction) {
        const currentTime = new Date().getTime();
        const delta = currentTime - lastAction;

        if (delta > TIMEOUT) {
          const stake = await getStake({ wallet, gameContractAddr });
          setPlayer1Timeouted(true);

          if (stake === '0') {
            gameOver(GameOverStatus.Winned);
          } else {
            gameOver(GameOverStatus.Timeouted);

            if (await player1Timeout({ wallet, gameContractAddr })) {
              gameOver(GameOverStatus.Winned);
            }
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [wallet, gameContractAddr, lastAction, player1Timeouted]);

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
      <Backdrop open={gameOverStatus !== GameOverStatus.GameOver} sx={{ zIndex: 999999 }}>
        <CircularProgress />
      </Backdrop>
      {gameOverStatus ? (
        <Typography variant="h3" >
          {GAME_OVER_MESSAGES[gameOverStatus]}
        </Typography >
      ) : wallet.status === 'connected' ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Joined Game
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Game Contract Address: {gameContractAddr}
          </Typography>
        </Box>
      ) : (
        <Typography variant="h5">
          Please connect your wallet
        </Typography>
      )}
    </>
  );
};

export default JoinedGame;
