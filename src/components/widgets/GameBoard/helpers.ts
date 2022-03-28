import Web3 from 'web3';
import { AbiItem, toWei } from 'web3-utils'
import { CONTRACT_DEPLOYMENT, NETWORK, RPS_BIN } from 'config/contracts';
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
  const estimatedGas = await deployment.estimateGas();
  const gasPrice = await web3.eth.getGasPrice();

  return await deployment.send({ from, gas: estimatedGas, gasPrice, value, });
};

export const getCommitment = async ({ wallet, movement, salt }: {
  wallet: Wallet,
  movement: Move,
  salt: number
}) => {
  const web3 = new Web3(wallet.ethereum);
  const contract = new web3.eth.Contract(Hasher_ABI as AbiItem[], CONTRACT_DEPLOYMENT[NETWORK].Hasher);
  return await contract.methods.hash(movement, salt).call();
};
