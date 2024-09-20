"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@/app/style.css";

export default function AppWalletProvider({
    children,
    networkEndpoint
}: Readonly<{
    children: React.ReactNode;
    networkEndpoint: "mainnet" | "devnet"
}>) {
    // State to hold the full RPC endpoint URL
    const [endpoint, setEndpoint] = useState<string | null>(null);

    useEffect(() => {
        // Construct the full URL when the component mounts
        const protocol = window.location.protocol;
        const host = window.location.host;

        let fullRpcUrl: string
        let rpcChain = networkEndpoint;
        let proxy = process.env.NEXT_PUBLIC_PROXY === "true";

        const HELIOS_API_KEYS: string[] = process.env.NEXT_PUBLIC_HELIOS_API_KEYS?.split(',') || [];
        const getRandomApiKey = (): string => {
            const randomIndex = Math.floor(Math.random() * HELIOS_API_KEYS.length);
            return HELIOS_API_KEYS[randomIndex];
        };

        if (rpcChain === "mainnet") {
            if (proxy) {
                fullRpcUrl = `${protocol}//${host}/rpc/mainnet`;
            } else {
                fullRpcUrl = `https://mainnet.helius-rpc.com/?api-key=${getRandomApiKey()}`;
            }
        } else {
            if (proxy) {
                fullRpcUrl = `${protocol}//${host}/rpc/devnet`;
            } else {
                fullRpcUrl = `https://api.devnet.solana.com`;
            }
        }

        setEndpoint(fullRpcUrl);
    }, []);

    const wallets = useMemo(
        () => [
            // manually add any legacy wallet adapters here
            // new UnsafeBurnerWalletAdapter(),
        ],
        [endpoint],
    );

    // Don't render anything until we have the full endpoint URL
    if (!endpoint) {
        return null;
    }

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}