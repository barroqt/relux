// @ts-ignore
'use client';
import React, { useEffect, useContext } from "react";
import Link from 'next/link';
import Image from "next/image";
import {
  useAccount,
} from 'wagmi';
import styles from './account.module.css'
import Balance from '@/components/Balance';
import Transactions from '@/components/Transactions';
import Web3Context from "@/store/Web3Context";

type Props = {};

const AccountPage = (props: Props) => {
  const {
    //isConnected,
    address,
    /*addresses,
    chainId,
    isConnecting,
    isDisconnected,
    isReconnecting,
    status*/
  } = useAccount();

  const {
    loadingTx,
    transactions,
    getTransaction,
  } = useContext(Web3Context);

  useEffect(() => {
    console.log('didMount');
  }, []);

  return (
    <div
      style={{
        maxWidth: "768px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        paddingTop: '25px',
      }}
    >
      {!address && <h3 style={{ fontWeight: '200' }}>Connect an account to join the game.</h3>}
      {address && <h3>Connected with {address}</h3>}
    </div>
  );
};

export default AccountPage;
