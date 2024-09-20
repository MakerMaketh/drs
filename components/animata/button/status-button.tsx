import React, { forwardRef, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleDashed, XCircle, Wallet } from "lucide-react";
import { VT323 } from "next/font/google";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const vt322 = VT323({ subsets: ["latin"], weight: "400" });

interface StatusButtonProps {
    className?: string;
    text: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    status: "loading" | "Won" | "Lost" | string;
    disabled?: boolean;
}

const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>((
    { className = "", text, onClick, status, disabled = false }: StatusButtonProps,
    ref
) => {
    const { connected, connecting, wallet, connect, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isEnabled = connected && !disabled;

    const handleWalletAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!connected && !connecting) {
            setIsConnecting(true);
            try {
                if (wallet) {
                    await connect();
                } else {
                    setVisible(true);
                }
            } catch (error) {
                console.error("Failed to connect wallet:", error);
            } finally {
                setIsConnecting(false);
            }
        } else if (connected) {
            await disconnect();
        }
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!connected) {
            handleWalletAction(e);
        } else if (isEnabled && onClick) {
            setIsLoading(true);
            try {
                await onClick(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const statusColor =
        status === "Won"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : status === "Lost"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-black border border-gray-400 text-white hover:bg-white hover:text-black";

    return (
        <button
            ref={ref}
            onClick={handleClick}
            disabled={connected && !isEnabled}
            className={`overflow-hidden h-10 ${vt322.className}
                ${statusColor} transition-colors duration-300 ${className} ${(connected && !isEnabled) || disabled ? "opacity-50 cursor-not-allowed" : ""} 
                ${isLoading || status === "loading" || status === "Won" || status === "Lost" ? "cursor-not-allowed" : ""}`
            }
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={connected ? (isLoading ? "loading" : status) : "connect"}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.075 }}
                    className="flex items-center justify-center gap-1"
                >
                    {!connected && (
                        <>
                            <Wallet className="h-4 w-4" />
                            {isConnecting || connecting ? "Connecting..." : "Connect"}
                        </>
                    )}
                    {connected && (
                        <>
                            {isLoading || status === "loading" ? (
                                <CircleDashed className="h-4 w-4 animate-spin" />
                            ) : status === "Won" ? (
                                <motion.span
                                    className="h-fit w-fit"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.075, type: "spring" }}
                                >
                                    <CheckCircle2 className="h-4 w-4 fill-white stroke-green-500 group-hover:stroke-green-600" />
                                </motion.span>
                            ) : status === "Lost" || status === "Error" ? (
                                <motion.span
                                    className="h-fit w-fit"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.075, type: "spring" }}
                                >
                                    <XCircle className="h-4 w-4 fill-white stroke-red-500 group-hover:stroke-red-600" />
                                </motion.span>
                            ) : null}
                            {isLoading && status !== "loading" ? "Processing..." : status === "loading" ? "" : status ?? `${text}`}
                        </>
                    )}
                </motion.span>
            </AnimatePresence>
        </button>
    );
});

StatusButton.displayName = "StatusButton";

export default StatusButton;