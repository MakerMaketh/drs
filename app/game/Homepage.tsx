"use client";

import RouletteTable from "@/app/game/RouletteClient";
import AppWalletProvider from "@/components/AppWalletProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Bet } from '@/app/game/Global';


export default function HomeLayout({
    networkEndpoint,
    noBetsPhrase = 'No bets to display'
}: {
    networkEndpoint: "mainnet" | "devnet",
    noBetsPhrase?: string;
}) {
    const [allBets, setAllBets] = useState<Bet[]>([]);
    const [myBets, setMyBets] = useState<Bet[]>([]);

    return (
        <AppWalletProvider networkEndpoint={networkEndpoint}>
            <Header allBets={allBets} networkEndpoint={networkEndpoint} />
            <div className="flex-grow overflow-y-auto pt-16 pb-16">
                <RouletteTable networkEndpoint={networkEndpoint} noBetsPhrase={noBetsPhrase} allBets={allBets} setAllBets={setAllBets} myBets={myBets} setMyBets={setMyBets} />
            </div>
            <Footer />
        </AppWalletProvider>
    );
}
