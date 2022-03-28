import Web3 from 'web3';
import { AbiItem, toWei } from 'web3-utils'
import {
  CONTRACT_DEPLOYMENT,
  DEFAULT_GAS,
  DEFAULT_GAS_PRICE,
  NETWORK,
  RPS_BIN
} from 'config/contracts';
import { Wallet } from 'use-wallet/dist/cjs/types';
import { Move } from 'config/rps';
import RPS_ABI from 'config/ABIs/rps-abi.json';
import Hasher_ABI from 'config/ABIs/hasher-abi.json';

export const createGameContract = async ({ wallet, staking, params }: {
  wallet: Wallet,
  staking: string,
  params: string[]
}) => {
  const web3 = new Web3(wallet.ethereum);
  const from = wallet.account as string;
  const value = toWei(staking, 'ether')

  const deployment = new web3.eth.Contract(RPS_ABI as AbiItem[])
    .deploy({ data: RPS_BIN, arguments: params });

  try {
    const contract = await deployment.send({
      from,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
      value
    });
    return contract.options.address;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getCommitment = async ({ wallet, movement, salt }: {
  wallet: Wallet,
  movement: Move,
  salt: number
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(
    Hasher_ABI as AbiItem[],
    CONTRACT_DEPLOYMENT[NETWORK].Hasher
  );
  return await contract.methods.hash(movement, salt).call();
};

export const joinGame = async ({ wallet, gameContractAddr, movement }: {
  wallet: Wallet,
  gameContractAddr: string,
  movement: Move
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);
  const stake = await contract.methods.stake().call();

  try {
    await contract.methods.play(movement).send({
      value: stake,
      from: wallet.account as string,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const checkPlayerReacted = async ({ wallet, gameContractAddr }: {
  wallet: Wallet,
  gameContractAddr: string,
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);
  const c2 = await contract.methods.c2().call();
  return parseInt(c2) > 0;
};

export const checkPlayer1Solved = async ({ wallet, gameContractAddr }: {
  wallet: Wallet,
  gameContractAddr: string,
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);
  const stake = await contract.methods.stake().call();
  return parseInt(stake) === 0;
};

export const checkWinningStatus = async ({ wallet, gameContractAddr, salt, movement }: {
  wallet: Wallet,
  gameContractAddr: string,
  salt: string,
  movement: string,
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);
  const c2 = await contract.methods.c2().call();
  const stake = await contract.methods.stake().call();

  if (stake === '0') {
    return await contract.methods.win(movement, c2).call();
  } else {
    return null;
  }
};

export const player1Timeout = async ({ wallet, gameContractAddr }: {
  wallet: Wallet,
  gameContractAddr: string,
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);
  
  try {
    await contract.methods.j1Timeout().send({
      from: wallet.account as string,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
    });
    return true;
  } catch {
    return false;
  }
};

export const player2Timeout = async ({ wallet, gameContractAddr }: {
  wallet: Wallet,
  gameContractAddr: string,
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);
  
  try {
    await contract.methods.j2Timeout().send({
      from: wallet.account as string,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
    });
    return true;
  } catch {
    return false;
  }
};

export const solve = async ({ wallet, gameContractAddr, salt, movement }: {
  wallet: Wallet,
  gameContractAddr: string,
  salt: string,
  movement: string,
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(RPS_ABI as AbiItem[], gameContractAddr);

  try {
    await contract.methods.solve(movement, salt).send({
      from: wallet.account as string,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
    });
  } catch (err) {
    console.error(err);
    return null;
  }

  const c2 = await contract.methods.c2().call();
  return await contract.methods.win(movement, c2).call();
};
