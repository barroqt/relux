'use client';

import { 
	createConfig,
	cookieStorage,
	createStorage
} from 'wagmi'
import { defineChain, http } from 'viem';

export const arbitrumSepolia = defineChain({
  id: 421614,
  name: 'Arbitrum Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://endpoints.omniatech.io/v1/arbitrum/sepolia/public'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia.arbiscan.io/' },
  },
});

export const sepolia = defineChain({
  id: 11155111,
  name: 'Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.dev'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://eth-sepolia.blockscout.com' },
  },
});

export const scrollSepolia = defineChain({
  id: 534351,
  name: 'Scroll Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://scroll-sepolia.drpc.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia.scrollscan.com/' },
  },
});

export const zircuitSepolia = defineChain({
  id: 48899,
  name: 'Zircuit Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://zircuit1.p2pify.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.zircuit.com/' },
  },
});

export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://base-sepolia-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia.basescan.org/' },
  },
});

export const config = createConfig({
  chains: [
    sepolia,
    baseSepolia,
    scrollSepolia,
    zircuitSepolia,
    arbitrumSepolia,
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [scrollSepolia.id]: http(),
    [zircuitSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

