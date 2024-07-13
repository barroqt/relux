"use client";

import { WagmiProvider, cookieToInitialState } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config as wagmiConfig } from "../config/wagmiConfig";
import { Web3ContextProvider } from "@/store/Web3Context";
//import { Web2ContextProvider } from "@/store/Web2Context";

const queryClient = new QueryClient();

type Props = {
    children: React.ReactNode;
    cookie?: string | null;
};

export default function Providers({ children, cookie }: Props) {
    const initialState = cookieToInitialState(wagmiConfig, cookie);

    return (
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <Web3ContextProvider>
                    {/*<Web2ContextProvider>*/}
                        {children}
                    {/*</Web2ContextProvider>*/}
                </Web3ContextProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}