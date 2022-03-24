import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { CONTRACT_DEPLOYMENT, NETWORK, RPS_BIN } from 'config/contracts';
import { Wallet } from 'use-wallet/dist/cjs/types';
import { Move } from 'config/rps';
import RPS_ABI from 'config/ABIs/rps-abi.json';
import Hasher_ABI from 'config/ABIs/hasher-abi.json';

export const createGameContract = async (wallet: Wallet, args: string[]) => {
  const web3 = new Web3(wallet.ethereum);
  return await new web3.eth.Contract(RPS_ABI as AbiItem[])
    .deploy({ data: RPS_BIN, arguments: args })
    .send({
      from: wallet.account as string,
      gas: 1500000,
      gasPrice: '1500000000'
    });
};

export const getCommitment = async (wallet: Wallet, movement: Move, salt: number) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(Hasher_ABI as AbiItem[], CONTRACT_DEPLOYMENT[NETWORK].Hasher);
  return await contract.methods.hash(movement, salt);
};
