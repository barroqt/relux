// @ts-ignore

import React, { useEffect, useState } from "react";
import ReluxMarketplace from '@/contracts/ReluxMarketplace.json';

import config from "../config";
import { publicClient, walletClient } from "@/config/client";
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
  createListing: (id: string, price: number) => { },
  buyWatch: (account: string, id: string) => { },
  cancelListing: (account: string, id: string) => { },
  getListing: (id: string) => { },
  getAllListings: () => { },
  switchChain: (idChain: number) => {},
});

type Props = {};

const apiBlockScout = {};

export const listingEnum = {
  'watchId': 0,
  'seller': 1,
  'price': 2,
  'isSold': 3,
};

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
    return publicClient.watchContractEvent({
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
    return publicClient.watchContractEvent({
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

  const createListing = async (account: string, id: string, price: number) => {
    console.log('createListing');
    try {
      setLoadingCreateList(true);
      const chains = config.chains;
      const marketplaceContract = chains.arbitrumSepolia.contract_marketplace;
      
      const { request } = await publicClient.simulateContract({
        account,
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'createListing',
        args: [id, price],
      });
      const write = await walletClient.writeContract(request);
      setLoadingCreateList(false);
      getAllListings();
    } catch (e) {
      setLoadingCreateList(false);
      console.log(e)
    }
  }

  const buyWatch = async (account: string, id: string) => {
    console.log('buyWatch');
    try {
      setLoadingBuyWatch(true);
      const chains = config.chains;
      const marketplaceContract = chains.arbitrumSepolia.contract_marketplace;
      
      const { request } = await publicClient.simulateContract({
        account,
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'buyWatch',
        args: [id],
      });
      const write = await walletClient.writeContract(request);
      console.log({ write });
      setLoadingBuyWatch(false);
    } catch (e) {
      setLoadingBuyWatch(false);
      console.log(e)
    }
  }

  const cancelListing = async (account: string, id: string) => {
    console.log('cancelListing');
    try {
      setLoadingCancelListing(true);
      const chains = config.chains;
      const marketplaceContract = chains.arbitrumSepolia.contract_marketplace;
      
      const { request } = await publicClient.simulateContract({
        account,
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'cancelListing',
        args: [id],
      });
      const write = await walletClient.writeContract(request);
      console.log({ write });
      setLoadingCancelListing(false);
      getAllListings();
    } catch (e) {
      setLoadingCancelListing(false);
      console.log(e)
    }
  }

  const getListing = async (account: string, id: string) => {
    console.log('getListing');
    try {
      setLoadingGetListing(true);
      const chains = config.chains;
      const marketplaceContract = chains.arbitrumSepolia.contract_marketplace;

      const listing = await publicClient.readContract({
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

  const getAllListings = async () => {
    console.log('getAllListings');
    try {
      setLoadingListings(true);
      const chains = config.chains;
      const marketplaceContract = chains.arbitrumSepolia.contract_marketplace;
      const listingCount = await publicClient.readContract({
        address: marketplaceContract,
        abi: ReluxMarketplace.abi,
        functionName: 'listingCount',
      })
      const count = parseInt(listingCount);
      console.log({ count });
      if (count) {
        const newList = [];
        for (let i = count; i > 0; i--) {
          const trade = await publicClient.readContract({
            address: marketplaceContract,
            abi: ReluxMarketplace.abi,
            functionName: 'listings',
            args: [i],
          });

          if (trade && trade.length && trade[listingEnum.seller] != "0x0000000000000000000000000000000000000000") {
            //trade[listingEnum.watchId] = i;
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
      const response = await fetch(apiBlockScout.nftList(config.chains.arbitrumSepolia.contract_marketplace));
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

  const switchChain = async (idChain: number) => {
    try {
      console.log('switchChain');
      if (walletClient && !loadingSwitch) {
        setLoadingSwitch(true);
        await walletClient.switchChain({ id: idChain });
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingSwitch(false);
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
      }}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3Context;

