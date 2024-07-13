'use client';

import React, { useState, useEffect, useContext } from 'react';
import { arbitrumSepolia, sepolia } from "@/config/wagmiConfig";
import {
  useAccount,
} from 'wagmi';
import styles from "./page.module.css";
import Web3Context from "@/store/Web3Context";
import { parseEther } from 'viem';
import Link from 'next/link';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const [currentOption, setCurrentOption] = useState(arbitrumSepolia.id);
  const {
    getNfts,
    loadingNft,
    loadingMint,
    loadingSwitch,
    actionMint,
    switchChain,
  } = useContext(Web3Context);

  const { address, chainId } = useAccount();

  useEffect(() => {
    console.log({ currentOption });
    if (currentOption && !loadingSwitch && chainId != currentOption)
      switchChain(currentOption);
  }, [currentOption]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontWeight: '200' }}>Welcome !</h1>
        <h3 style={{ marginBottom: '20px', fontWeight: '200' }}>ChainId: {chainId}</h3>

        <select onChange={(e: React.FormEvent<HTMLSelectElement>) => setCurrentOption(e.target.value)} className={styles.selectChain}>
          <option defaultValue={arbitrumSepolia.id}>{arbitrumSepolia.name}</option>
          <option value={sepolia.id}>{sepolia.name}</option>
        </select>

      </div>
    </>
  );
}
