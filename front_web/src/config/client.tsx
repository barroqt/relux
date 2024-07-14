'use client';

import { arbitrumSepolia, baseSepolia, scrollSepolia, zircuitSepolia } from './wagmiConfig';
import { createPublicClient, http, createWalletClient, custom } from 'viem';

export const publicClientArbitrumSepolia = createPublicClient({
  chain: arbitrumSepolia,
  transport: http()
})

export const walletClientArbitrumSepolia = process.browser ? createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum!)
}) : null;

export const publicClientBaseSepolia = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

export const walletClientBaseSepolia = process.browser ? createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!)
}) : null;

export const publicClientScrollSepolia = createPublicClient({
  chain: scrollSepolia,
  transport: http()
})

export const walletClientScrollSepolia = process.browser ? createWalletClient({
  chain: scrollSepolia,
  transport: custom(window.ethereum!)
}) : null;

export const publicClientZircuitSepolia = createPublicClient({
  chain: zircuitSepolia,
  transport: http()
})

export const walletClientZircuitSepolia = process.browser ? createWalletClient({
  chain: zircuitSepolia,
  transport: custom(window.ethereum!)
}) : null;


export const chainsList = {
    '421614': { // arbitrumSepolia
        contract_marketplace: '0xA8Ee30376Eb19172431362d07D3CA9da7403D3D0',
        contract_usdc: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
        contract_eth: '0x7de5bffc5370d93b974b67bab4492a9e13b8b3c1',
        publicClient: publicClientArbitrumSepolia,
        walletClient: walletClientArbitrumSepolia,
    },
    '11155111': { // sepolia
    },
    '534351': { // scrollSepolia
        contract_marketplace: '0xA8Ee30376Eb19172431362d07D3CA9da7403D3D0',
        publicClient: publicClientScrollSepolia,
        walletClient: walletClientScrollSepolia,
    },
    '48899': { // zircuitSepolia
        contract_marketplace: '0x4E86f0d4Ee46Fa412C5D414a627602E02c0035F5',
        publicClient: publicClientZircuitSepolia,
        walletClient: walletClientZircuitSepolia,
    },
    '84532': { // baseSepolia
        contract_marketplace: '0xa4D51A03caFE6BbeAdA75DeC2b2b82EF623e0480',
        publicClient: publicClientBaseSepolia,
        walletClient: walletClientBaseSepolia,    
    },
}
