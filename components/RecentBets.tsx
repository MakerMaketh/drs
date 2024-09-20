"use client";
import { useEffect } from "react";
import Image from 'next/image';
import DynamicIcon from "./DynamicNumIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bet, BetProps } from '@/app/game/Global';

interface BetsResponse {
    data: Bet[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    offset: number;
    limit: number;
}

export default function RecentBets({
    noBetsPhrase = "No bets to display",
    refreshTrigger = false,
    networkEndpoint,
    allBets,
    myBets,
    setAllBets,
    setMyBets
}: BetProps) {
    const { publicKey } = useWallet();
    let address = publicKey?.toBase58() || null;

    const supbaseDB = process.env.NEXT_PUBLIC_DB || "null";
    const tax = +(process.env.NEXT_PUBLIC_TAX_PERCENT ?? 5);

    useEffect(() => {
        if (networkEndpoint === 'mainnet') {
            fetchBets(`${supbaseDB}/read`, setAllBets);
            if (publicKey && publicKey?.toBase58()) {
                address = publicKey?.toBase58();
                fetchBets(`${supbaseDB}/read?walletId=${address}`, setMyBets);
            }
        }
        else {
            fetchBets(`${supbaseDB}/read?network=${networkEndpoint}`, setAllBets);
            if (publicKey && publicKey?.toBase58()) {
                address = publicKey?.toBase58();
                fetchBets(`${supbaseDB}/read?walletId=${address}&network=${networkEndpoint}`, setMyBets);
            }
        }


    }, [publicKey, refreshTrigger]);

    const fetchBets = async (
        url: string,
        setter: React.Dispatch<React.SetStateAction<Bet[]>>
    ) => {
        try {
            const response = await fetch(url);
            const data: BetsResponse = await response.json();
            setter(data.data);
        } catch (error) {
            console.error("Error fetching bets:", error);
        }
    };

    const shortFormatText = (text: string, strip: number = 3) => {
        return `${text.slice(0, strip)}...${text.slice(-1 * strip)}`;
    };

    const lamportsToSol = (lamports: number) => {
        return (+(lamports / LAMPORTS_PER_SOL).toFixed(4));
    };

    const wrappedLamportsToSol = (lamports: number) => {
        let result = lamports / LAMPORTS_PER_SOL;
        if (result === 0) {
            return '-';
        } return (+result.toFixed(4));
    };

    const getPayouts = (choice: string, wager: number, result: string) => {
        let payout = 0;
        let taxation = 0;
        let profit = 0;

        if (result === 'WIN') {
            switch (choice) {
                case 'RED':
                case 'BLACK':
                case 'EVEN':
                case 'ODD':
                case '1-18':
                case '19-36':
                    profit = wager;
                    break;
                case '1st 12':
                case '2nd 12':
                case '3rd 12':
                    profit = wager * 2;
                    break;
                default:
                    profit = wager;
                    break;
            }

            taxation = profit * (tax * 0.01);
            payout = wager + (profit - taxation);
            return payout;
        }
        return 0;
    };


    const handleRowClick = (text: string, tx: boolean = false) => {
        let chain = networkEndpoint;
        let networkchain: string;

        if (chain === 'mainnet') {
            if (tx) {
                window.open(
                    `https://solscan.io/tx/${text}`,
                    "_blank"
                );
            } else {
                window.open(
                    `https://solscan.io/account/${text}`,
                    "_blank"
                );
            }
        } else {
            //custom&customUrl=%20https://api.devnet.solana.com
            if (chain === 'devnet') { networkchain = 'devnet-alpha' } else { networkchain = chain };

            if (tx) {
                window.open(
                    `https://solana.fm/tx/${text}?cluster=${networkchain}`,
                    "_blank"
                );
            } else {
                window.open(
                    `https://solana.fm/address/${text}?cluster=${networkchain}`,
                    "_blank"
                );
            }
        }
    };

    const renderBetsTable = (bets: Bet[]) => {
        if (bets.length === 0) {
            return (
                <div>
                    {noBetsPhrase}
                </div>
            );
        }

        // Limit bets to a maximum of 10 items
        const limitedBets = bets.slice(0, 10);


        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deposit TX</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Wager</TableHead>
                        <TableHead>Payout</TableHead>
                        <TableHead>Withdraw TX</TableHead>
                        <TableHead>Choice</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {limitedBets.map((bet) => (
                        <TableRow
                            key={bet.identifier}
                            className="hover:bg-gray-100"
                        >
                            <TableCell
                                className="cursor-pointer hover:underline"
                                onClick={() => handleRowClick(bet.depositTxn, true)}
                            >
                                {shortFormatText(bet.depositTxn, 5)}
                            </TableCell>
                            <TableCell>{moment(bet.createdAt).fromNow()}</TableCell>
                            <TableCell
                                className="cursor-pointer hover:underline"
                                onClick={() => handleRowClick(bet.walletId)}
                            >
                                {shortFormatText(bet.walletId, 4)}
                            </TableCell>
                            <TableCell>
                                <Image src="/sol.svg" alt="SOL" width={16} height={16} className="inline-block mr-1" />
                                {lamportsToSol(bet.amount)}
                            </TableCell>
                            <TableCell>
                                {wrappedLamportsToSol(getPayouts(bet.choice, bet.amount, bet.result)) !== "-" && (
                                    <Image src="/sol.svg" alt="SOL" width={16} height={16} className="inline-block mr-1" />
                                )}
                                {wrappedLamportsToSol(getPayouts(bet.choice, bet.amount, bet.result))}
                            </TableCell>
                            <TableCell
                                className="cursor-pointer hover:underline"
                                onClick={() => handleRowClick(bet.payoutTxn, true)}
                            >
                                {bet.payoutTxn ? shortFormatText(bet.payoutTxn, 5) : '-'}
                            </TableCell>
                            <TableCell>{bet.choice}</TableCell>
                            <TableCell>
                                {
                                    <div className="w-5 h-5">
                                        <DynamicIcon number={bet.outcome} />
                                    </div>
                                }
                            </TableCell>
                            <TableCell
                                className={
                                    bet.result === 'WIN'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }
                            >
                                {bet.result}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <Card className="w-full border border-gray-400 rounded">
            <CardHeader>
                <CardTitle>Recent Bets</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all-bets" className="w-full ">
                    <div className="flex justify-between items-center mb-4">
                        <TabsList>
                            <TabsTrigger value="all-bets">All Bets</TabsTrigger>
                            <TabsTrigger value="my-bets" disabled={address === null}>
                                My Bets
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="all-bets">{renderBetsTable(allBets)}</TabsContent>
                    <TabsContent value="my-bets">
                        {address != null && renderBetsTable(myBets)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
