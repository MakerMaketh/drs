import React, { useState, useEffect } from "react"
import Image from 'next/image';
import { DollarSign, Trophy, Skull, Medal, Coins, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

type NetworkEndpoint = "mainnet" | "devnet";
type LeaderboardType = "wagers" | "wins" | "loses";

interface LeaderboardItem {
    walletId: string;
    wagers: number;
    wins: number;
    loses: number;
    WageredAmount: number;
    WinAmount: number;
    LossAmount: number;
}

interface LeaderboardResponse {
    data: LeaderboardItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    offset: number;
    limit: number;
}

const leaderboardTypes: Record<LeaderboardType, { title: string; description: string; icon: React.ElementType }> = {
    wagers: {
        title: "Biggest Degens",
        description: "Anons who ain't afraid to drop bags",
        icon: DollarSign,  // Icon representing wagers
    },
    wins: {
        title: "Chad Moves",
        description: "Anons stacking bags like legends",
        icon: Medal,  // Icon representing wins
    },
    loses: {
        title: "Rugged Hard",
        description: "Anons who got rekt chasing glory",
        icon: TrendingDown,  // Icon representing losses
    },
};


interface LBProps {
    networkEndpoint: NetworkEndpoint;
}

interface LeaderboardContentProps extends LBProps {
    isOpen: boolean;
}

const formatAmount = (amount: number): number => {
    return (+(amount / LAMPORTS_PER_SOL).toFixed(4));
}

const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ networkEndpoint, isOpen }) => {
    const [activeTab, setActiveTab] = useState<LeaderboardType>("wagers")
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const shortFormatText = (text: string, strip: number = 3) => {
        return `${text.slice(0, strip)}...${text.slice(-1 * strip)}`;
    };

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            if (!isOpen) return
            setIsLoading(true)
            try {
                let link: string;
                link = `/api/telemetry/leaderboard?limit=50&type=${activeTab}`;
                if (networkEndpoint != "mainnet") link += `&network=${networkEndpoint}`

                const response = await fetch(link)
                if (!response.ok) throw new Error('Failed to fetch data')

                const data: LeaderboardResponse = await response.json()
                setLeaderboardData(data.data)
            } catch (error) {
                console.error("Error fetching leaderboard data:", error)
                setLeaderboardData([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeaderboardData()
    }, [networkEndpoint, activeTab, isOpen])

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

    const renderTableContent = (item: LeaderboardItem, index: number) => {
        switch (activeTab) {
            case "wagers":
                return (
                    <>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                            className="cursor-pointer hover:underline"
                            onClick={() => handleRowClick(item.walletId)}
                        >
                            {shortFormatText(item.walletId)}
                        </TableCell>
                        <TableCell>
                            <Image src="/sol.svg" alt="SOL" width={16} height={16} className="inline-block mr-1" />
                            {formatAmount(item.WageredAmount)}
                        </TableCell>
                    </>
                )
            case "wins":
                return (
                    <>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                            className="cursor-pointer hover:underline"
                            onClick={() => handleRowClick(item.walletId)}
                        >
                            {shortFormatText(item.walletId)}
                        </TableCell>
                        <TableCell>
                            <Image src="/sol.svg" alt="SOL" width={16} height={16} className="inline-block mr-1" />
                            {formatAmount(item.WinAmount)}
                        </TableCell>
                    </>
                )
            case "loses":
                return (
                    <>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                            className="cursor-pointer hover:underline"
                            onClick={() => handleRowClick(item.walletId)}
                        >
                            {shortFormatText(item.walletId)}
                        </TableCell>
                        <TableCell>
                            <Image src="/sol.svg" alt="SOL" width={16} height={16} className="inline-block mr-1" />
                            {formatAmount(item.LossAmount)}
                        </TableCell>
                    </>
                )
        }
    }

    return (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LeaderboardType)} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wagers">Wagers</TabsTrigger>
                <TabsTrigger value="wins">Winners</TabsTrigger>
                <TabsTrigger value="loses">Losers</TabsTrigger>
            </TabsList>
            <div className="flex-grow overflow-auto">
                <TabsContent value={activeTab} className="mt-3 h-[95%]">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                {React.createElement(leaderboardTypes[activeTab].icon, { className: "mr-2 h-5 w-5" })}
                                {leaderboardTypes[activeTab].title}
                            </CardTitle>
                            <CardDescription>{leaderboardTypes[activeTab].description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-auto">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">Loading...</div>
                            ) : (
                                leaderboardData && leaderboardData.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Anon</TableHead>
                                                <TableHead>
                                                    {activeTab === "wagers" ? "Wager" :
                                                        activeTab === "wins" ? "Loot" : "Donations"}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {leaderboardData.map((item, index) => (
                                                <TableRow key={item.walletId}>
                                                    {renderTableContent(item, index)}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        This is a new low
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>
        </Tabs >
    )
}

const LeaderboardComponent: React.FC<LBProps> = ({ networkEndpoint }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="flex justify-center">
            {/* Desktop: Dropdown */}
            <div className="hidden md:block">
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Trophy className="mr-2 h-4 w-4" />
                            Leaderboard
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[350px] h-[500px] overflow-y-auto">
                        <LeaderboardContent networkEndpoint={networkEndpoint} isOpen={isDropdownOpen} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Mobile: Dialog */}
            <div className="md:hidden">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Trophy className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[350px] h-[500px] overflow-y-auto">
                        <LeaderboardContent networkEndpoint={networkEndpoint} isOpen={isDialogOpen} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default LeaderboardComponent