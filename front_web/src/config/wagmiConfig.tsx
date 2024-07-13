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
      //webSocket: ['wss://ws.sepolia-api.com'],
    },
  },
  /*blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia-blockscout.com' },
  },*/
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

export const config = createConfig({
  chains: [arbitrumSepolia, sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [arbitrumSepolia.id]: http(),
    [sepolia.id]: http(),
  },
})

