"use client";

import { useEffect, useRef } from "react";
import {
    useAccount,
    useDisconnect,
} from 'wagmi'
import WalletOptions from './WalletOptions';

type Props = {
    onDisconnect: Function;
};

export const ConnectWallet = (props: Props) => {
    const { isConnecting, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div>
                <button
                    style={{
                        cursor: 'pointer',
                        padding: '5px'
                    }}
                    onClick={() => { 
                        disconnect();
                        if (props.onDisconnect) props.onDisconnect();
                    }}
                >Disconnect</button>
            </div>
        );
    }

    return (
        <WalletOptions />
    );
};