// @ts-ignore

import React, { useEffect, useState } from "react";
import ReluxMarketplace from '@/contracts/ReluxMarketplace.json';
import UsdcDeployed from '@/contracts/usdc.json';
import Erc20Deployed from '@/contracts/ERC20.json';

import config from "../config";
import { chainsList, publicClient, walletClient } from "@/config/client";
import { fromHex } from "viem";

const Web3Context = React.createContext({
  loading: false,
  loadingSwitch: false,
  loadingCreateList: false,
  loadingBuyWatch: false,
  loadingCancelListing: false,
  loadingGetListing: false,
  loadingListings: false,
  listings: null,
  createListing: (id: string, price: number, idChain: number) => { },
  buyWatch: (account: string, id: string, idChain: number) => { },
  cancelListing: (account: string, id: string, idChain: number) => { },
  getListing: (id: string) => { },
  getAllListings: (idChain: number) => { },
  switchChain: (oldChain: number, idChain: number) => {},
  approveUsdc: (account: string, to: string, price: number, idChain: number) => {},
});

type Props = {};

export const listingEnum = {
  'watchId': 0,
  'seller': 1,
  'price': 2,
  'listingTime': 3,
  'isDisputed': 4,
  'isSold': 5,
  'tokenId': 6,//added in web3Context
};

const apiBlockScout = {
  transactionsAddr: (address: string) => `https://base-sepolia.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`,
  nftList: (address: string) => `https://base-sepolia.blockscout.com/api/v2/tokens/${address}/instances`,
}

export const Web3ContextProvider = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [loadingCreateList, setLoadingCreateList] = useState(false);
  const [loadingBuyWatch, setLoadingBuyWatch] = useState(false);
  const [loadingCancelListing, setLoadingCancelListing] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingGetListing, setLoadingGetListing] = useState(false);
  const [listings, setListings] = useState(null);
  
  /*const setWatcherNFT = () => {
    console.count('run set Watched');
    return chains.publicClient.watchContractEvent({
      address: config.LISKSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
      abi: NFT_TTS.abi,
      eventName: 'Transfer',
      onLogs: async (logs) => {
        console.log('Contract on Transfer Event, log:', logs);
      },
    });
  };

  const setWatcherTrade = () => {
    console.count('run set Watched');
    return chains.publicClient.watchContractEvent({
      address: config.LISKSEPOLIA.CONTRACT_TRADE_TTS_ADDR as `0x${string}`,
      abi: Trade_TTS.abi,
      eventName: 'TradeStatusChange',
      onLogs: async (logs) => {
        console.log('Contract on TradeStatusChange Event, log:', logs);

        // reload trades & nfts
        await getTrades();
        await getNfts();
      },
    });
  };*/

  /*useEffect(() => {
    console.log('init - hello context');
    const unWatchNFT = setWatcherNFT();
    const unWatchTrade = setWatcherTrade();

    return () => {
      console.count('run useEffect return and unwatch Watched');
      unWatchNFT();
      unWatchTrade();
    };
  }, []);*/

  const createListing = async (account: string, id: string, price: number, idChain: number) => {
    console.log('createListing', idChain);
    try {
      setLoadingCreateList(true);
      const chains = chainsList[idChain];
      const marketplaceContract = chains.contract_marketplace;
      
      const { request } = await chains.publicClient.simulateContract({
        account,
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'createListing',
        args: [id, price],
      });
      const write = await chains.walletClient.writeContract(request);
      setLoadingCreateList(false);
      getAllListings(idChain);
    } catch (e) {
      setLoadingCreateList(false);
      console.log(e)
    }
  }

  const buyWatch = async (account: string, id: string, idChain: number) => {
    console.log('buyWatch', idChain);
    try {
      setLoadingBuyWatch(true);
      const chains = chainsList[idChain];
      const marketplaceContract = chains.contract_marketplace;
      
      const { request } = await chains.publicClient.simulateContract({
        account,
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'buyWatch',
        args: [id],
      });
      const write = await chains.walletClient.writeContract(request);
      console.log({ write });
      setLoadingBuyWatch(false);
    } catch (e) {
      setLoadingBuyWatch(false);
      console.log(e)
    }
  }

  const cancelListing = async (account: string, id: string, idChain: number) => {
    console.log('cancelListing', account, id, idChain);
    try {
      setLoadingCancelListing(true);
      const chains = chainsList[idChain];
      const marketplaceContract = chains.contract_marketplace;
      
      const { request } = await chains.publicClient.simulateContract({
        account,
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'cancelListing',
        args: [id],
      });
      const write = await chains.walletClient.writeContract(request);
      console.log({ write });
      setLoadingCancelListing(false);
      getAllListings(idChain);
    } catch (e) {
      setLoadingCancelListing(false);
      console.log(e)
    }
  }

  const getListing = async (account: string, id: string, idChain: number) => {
    console.log('getListing', idChain);
    try {
      setLoadingGetListing(true);
      const chains = chainsList[idChain];
      const marketplaceContract = chains.contract_marketplace;

      const listing = await chains.publicClient.readContract({
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'listings',
        args: [id],
      });

      console.log({ listing });
      setLoadingGetListing(false);
    } catch (e) {
      setLoadingGetListing(false);
      console.log(e)
    }
  }

  const getAllListings = async (idChain: number) => {
    console.log('getAllListings', idChain);
    try {
      setLoadingListings(true);
      const chains = chainsList[idChain];
      const marketplaceContract = chains.contract_marketplace;
      const listingCount = await chains.publicClient.readContract({
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'listingCount',
      })
      const count = parseInt(listingCount);
      console.log({ count });
      if (count) {
        const newList = [];
        for (let i = count; i > 0; i--) {
          const trade = await chains.publicClient.readContract({
            address: marketplaceContract,
            abi: ReluxMarketplace.abi,
            functionName: 'listings',
            args: [i],
          });

          if (trade && trade.length && trade[listingEnum.seller] != "0x0000000000000000000000000000000000000000") {
            trade[listingEnum.tokenId] = i;
            console.log({ trade });
            newList.push(trade);
          }
        }
        setListings(newList);
      }
      setLoadingListings(false);
    } catch (e) {
      setLoadingListings(false);
      console.log('error');
      console.log(e)
    }
  }

  const getNfts = async () => {
    console.log('getNfts');
    try {
      setLoadingNft(true);
      const response = await fetch(apiBlockScout.nftList(chainsList.arbitrumSepolia.contract_nft));
      const responseNfts = await response.json();
      setNfts(responseNfts);
      setLoadingNft(false);
      console.log({ responseNfts });
      return responseNfts;
    } catch (e) {
      setLoadingNft(false);
      console.log('error');
      console.log(e)
    }
  }

  const switchChain = async (oldChain: number, idChain: number) => {
    try {
      console.log('switchChain', idChain);
      const chains = chainsList[oldChain];
      if (chains.walletClient && !loadingSwitch && idChain) {
        setLoadingSwitch(true);
        await chains.walletClient.switchChain({ id: idChain });
        setListings(null);
        getAllListings(idChain);
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingSwitch(false);
  }

  const approveUsdc = async (account: string, to: string, price: number, idChain: number) => {
    try {
      console.log('approve');
      const chains = chainsList[idChain];
      const usdcContract = chains.contract_usdc;
      const { request } = await chains.publicClient.simulateContract({
        account,
        address: usdcContract,
        abi: Erc20Deployed.abi,
        functionName: 'approve',
        args: [account, price],
      });
      console.log(request);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Web3Context.Provider
      value={{
          loading,
          loadingSwitch,
          loadingCreateList,
          loadingBuyWatch,
          loadingCancelListing,
          loadingGetListing,
          loadingListings,
          listings,
          getAllListings,
          createListing,
          buyWatch,
          cancelListing,
          getListing,
          switchChain,
          approveUsdc,
      }}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3Context;

