import React, { useState, useEffect, useRef } from 'react';
import DynamicIcon from './DynamicNumIcon';

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

interface RibbonProps {
    noBetsPhrase?: string;
    allBets: Bet[];
}

const Ribbon: React.FC<RibbonProps> = ({ allBets, noBetsPhrase = "Wow, such empty!" }) => {
    const [solanaPrice, setSolanaPrice] = useState<string>('0');
    const [recentSpins, setRecentSpins] = useState<number[]>([]);
    const [redPercent, setRedPercent] = useState<number>(50);
    const [blackPercent, setBlackPercent] = useState<number>(50);

    const prevBetsRef = useRef<Bet[]>(allBets);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Solana price
                const priceResponse = await fetch('https://api.exchange.coinbase.com/products/SOL-USD/ticker');
                const priceData = await priceResponse.json();
                setSolanaPrice(priceData.price);

                // Check if allBets has changed
                if (prevBetsRef.current !== allBets) {
                    setRecentSpins(allBets.map(spin => spin.outcome));

                    // Calculate red/black percentages
                    const totalSpins = allBets.length;
                    if (totalSpins > 0) {
                        const redSpins = allBets.filter(spin => spin.choice === 'RED').length;
                        const redPercentValue = (redSpins / totalSpins) * 100;
                        setRedPercent(redPercentValue);
                        setBlackPercent(100 - redPercentValue);
                    }

                    // Update ref to current allBets
                    prevBetsRef.current = allBets;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 20000);
        return () => clearInterval(interval);
    }, [allBets]);


    const PercentageMeter: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
        return mobile ? (
            <div className="flex items-center w-full bg-gray-700 border border-gray-600 rounded-full overflow-hidden h-2 mt-1">
                <div className="bg-red-500 h-2" style={{ width: `${redPercent}%` }} />
                <div className="bg-black h-2" style={{ width: `${blackPercent}%` }} />
            </div>

        ) : (
            <div className="flex items-center w-1/6 text-white rounded h-6 pl-3 pr-3">
                <div className="flex items-center w-full bg-gray-700 rounded-full overflow-hidden h-6 mr-2 border border-gray-600">
                    <div
                        className="bg-red-500 h-6 flex items-center justify-center text-sm"
                        style={{ width: `${redPercent}%` }}
                    >
                        {(+redPercent.toFixed(1))}%
                    </div>
                    <div
                        className="bg-black h-6 flex items-center justify-center text-sm"
                        style={{ width: `${blackPercent}%` }}
                    >
                        {(+blackPercent.toFixed(1))}%
                    </div>
                </div>
            </div>
        )
    };


    const SpinIcons: React.FC<{ spins: number[], mobile?: boolean }> = ({ spins, mobile = false }) => {
        return mobile ? (
            <div className="flex items-center space-x-2 animate-slide p-1">
                {recentSpins.map((outcome, index) => (
                    <div key={index} className='rounded h-5 w-5 flex-shrink-0'>
                        <DynamicIcon number={outcome} />
                    </div>
                ))}
            </div>

        ) : (
            <div className="flex items-center space-x-1 animate-slide">
                {spins.map((outcome, index) => (
                    <div key={index} className='rounded w-8 flex-shrink-0'>
                        <DynamicIcon number={outcome} />
                    </div>
                ))}
            </div>
        )
    };

    return (
        <div className="w-full bg-gray-700 text-black rounded border border-gray-700">
            {/* Desktop View */}
            <div className="hidden md:flex space-x-8 justify-between bg-black items-center p-1">
                {/* Solana Price */}
                <div className="flex items-center text-white bg-black rounded w-1/8 pl-3 pr-3 ml-2">
                    <span className="text-lg">1 SOL: ${solanaPrice}</span>
                </div>

                {/* Recent Spins */}
                <span className="text-white text-lg">Spin Recap</span>
                <div className="flex-1 text-center text-white rounded pl-1 pr-1 bg-black h-8 border border-gray-300 overflow-hidden">
                    {recentSpins.length > 0 ? (
                        <SpinIcons spins={recentSpins} />
                    ) : (
                        <span className="text-lg">{noBetsPhrase}</span>
                    )}
                </div>

                {/* Red/Black Percentage Meter */}
                <PercentageMeter />
            </div>

            {/* Mobile View */}
            <div className="flex flex-col md:hidden items-center bg-black ">
                {/* Recent Spins with Spin Recap text */}
                <div className="w-full flex items-center px-2 py-1">
                    <span className="text-white text-sm font-bold whitespace-nowrap ml-1 mr-2">Spin Recap</span>
                    <div className="flex-grow h-7 text-white rounded overflow-hidden border border-gray-700">
                        {recentSpins.length > 0 ? (
                            <SpinIcons spins={recentSpins} mobile />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-sm">{noBetsPhrase}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Narrow Red/Black Percentage Line */}
                <PercentageMeter mobile />
            </div>

        </div>

    );
};

export default Ribbon;