require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.19",
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    zircuit: {
      url: process.env.ZIRCUIT_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    scrollTestnet: {
      url: process.env.SCROLL_TESTNET_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
