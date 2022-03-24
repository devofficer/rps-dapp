import React from "react";
import { SvgIconProps } from "@mui/material";
import BinanceWalletIcon from "components/icons/BinanceWalletIcon";
import MetaMaskIcon from "components/icons/MetaMaskIcon";
import TrustWalletIcon from "components/icons/TrustWalletIcon";

type Wallet = {
  id: string;
  title: string;
  icon: React.FC<SvgIconProps>;
  disabled: boolean;
};

const wallets: Wallet[] = [
  { id: 'injected', title: 'MetaMask', icon: MetaMaskIcon, disabled: false },
  { id: 'bsc', title: 'Binance Wallet', icon: BinanceWalletIcon, disabled: true },
  { id: 'injected', title: 'Trust Wallet', icon: TrustWalletIcon, disabled: true },
];

export default wallets;