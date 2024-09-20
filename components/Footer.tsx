import React, { useState } from "react";
import { FaTelegram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Footer = () => {
    const hide = true;
    const tax = +(process.env.NEXT_PUBLIC_TAX_PERCENT ?? 5);


    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50">
            <div className="backdrop-blur-md bg-black/30 rounded-t-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
                    <div className="flex space-x-6 items-center">
                        {!hide ? (
                            <>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SOCIALS_X}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-2xl hover:text-gray-400"
                                >
                                    <FaSquareXTwitter />
                                </a>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SOCIALS_TG}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-2xl hover:text-gray-400"
                                >
                                    <FaTelegram />
                                </a>
                            </>
                        ) : (
                            <>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SOCIALS_X}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-x2"
                                >
                                    [𝕏]
                                </a>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SOCIALS_TG}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-x2"
                                >
                                    [Telegram]
                                </a>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <p
                                            className="text-white text-x2 cursor-pointer"
                                        >
                                            [How-to-Play]
                                        </p>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] max-h-[70vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>How to Play Roulette (Degen Edition)</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold">Outside Bets &amp; Payouts</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Bet Type</TableHead>
                                                        <TableHead>Payout</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>1st, 2nd, 3rd 12</TableCell>
                                                        <TableCell>{(1 + (3 - 1) * (1 - tax * 0.01))}x</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Red/Black</TableCell>
                                                        <TableCell>{(1 + (2 - 1) * (1 - tax * 0.01))}x</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Odd/Even</TableCell>
                                                        <TableCell>{(1 + (2 - 1) * (1 - tax * 0.01))}x</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>1-18/19-36</TableCell>
                                                        <TableCell>{(1 + (2 - 1) * (1 - tax * 0.01))}x</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>

                                            <h3 className="text-lg font-bold">Degen Rules</h3>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Connect your wallet.</li>
                                                <li>Click `Place Wagers`.</li>
                                                <li>If you&apos;re a whale, go for the fattest chip on the right—it&apos;s all or nothing!</li>
                                                <li>Place your chips on your lucky bet types like a true degen.</li>
                                                <li>Spin that wheel and pray to the RNG gods!</li>
                                                <li>All spin outcomes are random AF. Don&apos;t believe us? Check out this nerdy research paper: <a href="https://doi.org/10.3390/app10020451" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Math Wizards Explain Random Number Generation</a></li>
                                                <li>Hit the jackpot? We&apos;ll shower you with your well-deserved payout.</li>
                                                <li>Feeling extra spicy? Multiple wagers are pooled together for maximum degen energy!</li>
                                            </ul>

                                            <p className="text-sm italic">Remember: The house always wins... but that&apos;s never stopped a true degen before!</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};


export default Footer;