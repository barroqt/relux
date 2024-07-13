'use client';

import { arbitrumSepolia, sepolia } from './wagmiConfig';
import { createPublicClient, http, createWalletClient, custom } from 'viem'

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http()
})

export const walletClient = process.browser ? createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum!)
}) : null;
