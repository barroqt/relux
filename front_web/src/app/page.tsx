'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  arbitrumSepolia,
  scrollSepolia,
  zircuitSepolia,
  baseSepolia,
} from "@/config/wagmiConfig";
import {
  useAccount,
} from 'wagmi';
import styles from "./page.module.css";
import Web3Context, { listingEnum } from "@/store/Web3Context";
import { parseEther, formatEther } from 'viem';
import Link from 'next/link';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const itemsIdToImg = [
  '/assets/image1.jpeg',
  '/assets/image2.jpeg',
  '/assets/image3.jpeg',
  '/assets/image4.jpeg',
  '/assets/image5.jpeg',
];

const itemsToSell = [
  { 
    id: 1,
    title: 'Watch',
    price: '0.002',
  },
  { 
    id: 2,
    title: 'Painting',
    price: '0.001',
  },
  { 
    id: 3,
    title: 'Car',
    price: '0.003',
  },
  { 
    id: 4,
    title: 'Shoes',
    price: '0.006',
  },
  { 
    id: 5,
    title: 'Bottle',
    price: '0.004',
  },
];

export default function Home() {
  const [currentChain, setCurrentChain] = useState(null);
  const [currentItemsToSell, setCurrentItemsToSell] = useState(1);
  const {
    loadingCreateList,
    loadingBuyWatch,
    loadingCancelListing,
    loadingGetListing,
    loadingListings,
    listings,
    loadingSwitch,
    createListing,
    buyWatch,
    cancelListing,
    getListing,
    getAllListings,
    switchChain,
    approveUsdc,
  } = useContext(Web3Context);

  const { address, chainId } = useAccount();

  useEffect(() => {
    console.log({ effectChain: currentChain });
    if (address && currentChain && !loadingSwitch && chainId != currentChain)
      switchChain(chainId, currentChain);
    else if (address && !currentChain && !loadingSwitch) {
      setCurrentChain(chainId);
      getAllListings(chainId);
    }
  }, [currentChain, address]);

  useEffect(() => {
    /*
      if (!loadingListings && !listings)
        getAllListings(currentChain);
    */
  }, []);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontWeight: '200' }}>Welcome !</h1>
          <h3 style={{ fontWeight: '200' }}>Address: {address ? address : 'Connect your wallet to continue'}</h3>
          {address && <h4 style={{ fontWeight: '200' }}>ChainId: {chainId}</h4>}
        </div>

        {address && <select value={currentChain ? currentChain : arbitrumSepolia.id} onChange={(e: React.FormEvent<HTMLSelectElement>) => setCurrentChain(e.target.value)} className={styles.selectChain}>
          <option value={arbitrumSepolia.id}>{arbitrumSepolia.name}</option>
          <option value={scrollSepolia.id}>{scrollSepolia.name}</option>
          <option value={zircuitSepolia.id}>{zircuitSepolia.name}</option>
          <option value={baseSepolia.id}>{baseSepolia.name}</option>
        </select>}

        {address && <>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '400' }}>Your items</h3>
            <div style={{ background: '#1f1f1f', borderRadius: '8px', padding: '5px', display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '250px' }}>
                <Carousel showThumbs={false} autoPlay={false} onChange={(e: number) => setCurrentItemsToSell(e)}>
                    {itemsToSell.map((e, index: number) => 
                      <div key={index}>
                        <img style={{ width: '200px' }} src={itemsIdToImg[index]} />
                      </div>)}
                </Carousel>
              </div>
              <div style={{ padding: '20px' }}>
                <h2>{itemsToSell[currentItemsToSell].title}</h2>
                <div
                  onClick={() => createListing(address, currentItemsToSell, parseEther(itemsToSell[currentItemsToSell].price), currentChain)}
                  style={{ cursor: 'pointer', padding: '5px', marginTop: '10px', border: '1px solid white', textAlign: 'center' }}>
                  Create offer at {itemsToSell[currentItemsToSell].price}ETH
                </div>
              </div>
            </div>
          </div>
        </>}

        {loadingListings && <p>Loading listings...</p>}
        {!loadingListings && !listings && <p>No listing</p>}
        {!loadingListings && !listings && <button style={{ maxWidth: '60px' }} onClick={() => getAllListings(currentChain)}>Reload</button>}
        {!loadingListings && address && listings && 
          <div>
            <h3 style={{ fontWeight: '400', marginTop: '15px' }}>Listings</h3>
            {!listings.length && <p>No listing</p>}
            {listings.map((e: any, index: number) => 
              <div style={{ display: 'flex', flexWrap: 'wrap', background: 'white', borderRadius: '8px', color: 'black', padding: '15px', margin: '10px' }} key={index}>
                <img style={{ width: '200px' }} src={itemsIdToImg[parseInt(e[listingEnum.watchId])]} />
                <div style={{ padding: '20px', boxSizing: 'border-box' }}>
                  <p>Name: {itemsToSell[parseInt(e[listingEnum.watchId])].title}</p>
                  <p>Seller: {e[listingEnum.seller]}</p>
                  <p>Price: {formatEther(parseInt(e[listingEnum.price]))}ETH</p>
                  <p>isSold: {parseInt(e[listingEnum.isSold]) > 0 ? 'true' : 'false'}</p>
                  {address && e[listingEnum.seller] == address && <button onClick={() => cancelListing(address, e[listingEnum.tokenId], currentChain)} style={{ padding: '5px 15px' }}>Cancel Sell</button>}
                  {address && e[listingEnum.seller] != address && <button onClick={() => approveUsdc(address, e[listingEnum.seller], e[listingEnum.tokenId], currentChain)} style={{ padding: '5px 15px' }}>Approve</button>}
                  {address && e[listingEnum.seller] != address && <button onClick={() => buyWatch(address, e[listingEnum.tokenId], currentChain)} style={{ padding: '5px 15px' }}>Buy</button>}
                </div>
              </div>
            )}
          </div>
        }

      </div>
    </>
  );
}
