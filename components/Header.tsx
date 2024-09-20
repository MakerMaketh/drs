import React from "react";
import Image from "next/image";
import { FaTelegram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import LeaderboardComponent from "./Leaderboard";
import Ribbon from "./Ribbon";

interface Bet {
    depositTxn: string;
    payoutTxn: string;
    createdAt: string;
    walletId: string;
    amount: number;
    outcome: number;
    identifier: string;
    choice: string;
    result: string;
}

const LABELS = {
    'change-wallet': 'Change Wallet',
    connecting: 'Connecting..',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Connect',
};

const Header = ({ allBets, networkEndpoint }: {
    allBets: Bet[];
    networkEndpoint: "mainnet" | "devnet",
}) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <Ribbon allBets={allBets} />
            <div className="backdrop-blur-md bg-black/30 rounded-b-lg">
                <div className="max-w-8xl mx-auto px-6 py-1 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/ricon.png"
                            alt={siteConfig.name}
                            width={60}
                            height={70}
                        />
                    </Link>
                    <div className="flex items-center space-x-3">
                        {isDesktop && (
                            <div className="flex items-center space-x-3">
                                {/*
                                <a href={`${process.env.NEXT_PUBLIC_SOCIALS_X}`} target="_blank" rel="noopener noreferrer">
                                    <FaSquareXTwitter className="text-white text-2xl hover:text-gray-400" />
                                </a>
                                <a href={`${process.env.NEXT_PUBLIC_SOCIALS_TG}`} target="_blank" rel="noopener noreferrer">
                                    <FaTelegram className="text-white text-2xl hover:text-gray-400" />
                                </a>
                                 */}
                            </div>
                        )}
                        <LeaderboardComponent networkEndpoint={networkEndpoint} />
                        <BaseWalletMultiButton
                            labels={LABELS}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;