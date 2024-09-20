"use client";
import React, { useState, useEffect, useRef } from 'react';
import { getColor, ROULETTE_WHEEL_NUMBERS, getParity, BetProps } from '@/app/game/Global';
import Image from 'next/image';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import crypto from 'crypto';
import Wheel from './RouletteWheel';
import LEDBoard from '@/components/animata/card/led-board';
import StatusButton from '@/components/animata/button/status-button';
import FAQ from '@/components/FAQ';
import { encryptAES, decryptAES } from '@/components/encrypter';
import { initiateTransaction } from '@/components/wallet/initiateTransaction';
import { sendPayouts } from '@/components/wallet/sendFromKey';
import { toast } from 'sonner';
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerClose
} from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import RecentBets from "@/components/RecentBets"

const RouletteTable: React.FC<BetProps> = ({
    networkEndpoint,
    noBetsPhrase = "No bets to display",
    allBets,
    myBets,
    setAllBets,
    setMyBets
}) => {

    type WagerType = '1-18' | '19-36' | '1st 12' | '2nd 12' | '3rd 12' | 'EVEN' | 'ODD' | 'RED' | 'BLACK';
    type ChipValue = 50000000 | 100000000 | 250000000 | 500000000 | 1000000000 | 5000000000;

    interface Wager {
        type: WagerType;
        amount: number;
    }

    const [spinResult, setSpinResult] = useState<number | null>(null);
    const [LEDString, setLEDString] = useState<string>("CONNECT WALLET");
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [tempLEDString, setTempLEDString] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "Won" | "Lost" | string>("Place Wager");
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [spinTime, setSpinTime] = useState<number>(16000);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [audioPath, setAudioPath] = useState<string | undefined>('/sounds/spinbeta.wav'); // '/sounds/spinbeta.wav'

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const tax = +(process.env.NEXT_PUBLIC_TAX_PERCENT ?? 5);

    useEffect(() => {
        if (audioPath) {
            if (!audioRef.current) {
                audioRef.current = new Audio(audioPath);
            }
            const audio = audioRef.current;

            audio.onerror = () => {
                console.error("Failed to load audio from the path:", audioPath);
                setAudioPath(undefined); // Reset audio path if loading fails
            };

            if (audioRef.current) {
                audio.onloadedmetadata = () => {
                    setSpinTime(audio.duration * 1000); // Update spinTime to audio duration in milliseconds
                };
                audio.onended = () => {
                    setSpinTime(16000); // Reset to default spinTime if audio ends
                };
            }
        }
    }, [audioPath]);

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wallet = useWallet(); // Get the wallet

    const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    /* Start*/

    const [bets, setBets] = useState<Wager[]>([]);
    const [selectedChip, setSelectedChip] = useState<ChipValue | null>(null);
    const [selectedType, setSelectedType] = useState<WagerType | null>(null);

    const chipValues: ChipValue[] = [50000000, 100000000, 250000000, 500000000, 1000000000, 5000000000];
    const firstRowBets: { type: WagerType, description: string }[] = [
        { type: '1st 12', description: '(Bet on numbers 1 to 12)' },
        { type: '2nd 12', description: '(Bet on numbers 13 to 24)' },
        { type: '3rd 12', description: '(Bet on numbers 25 to 36)' }
    ];
    const secondRowBets: WagerType[] = ['1-18', 'EVEN', 'RED', 'BLACK', 'ODD', '19-36'];

    const handleChipSelect = (value: ChipValue) => {
        if (!selectedChip || value != selectedChip) {
            setSelectedChip(value);
        } else {
            setSelectedChip(null);
        }
    };

    const handlePlaceBet = (type: WagerType) => {
        setSelectedType(type);
        if (selectedChip) {
            if (navigator.vibrate) {
                navigator.vibrate(60);
            }
            setBets([...bets, { type, amount: selectedChip }]);
        }
        else {
            setBets(prevBets => prevBets.filter(bet => bet.type !== type));
        }
    };

    function logisticMap(x: number, r: number): number {
        return r * x * (1 - x);
    }

    function getRandomIndex(max: number): number {
        // Generate a cryptographically secure random seed for x between 0 and 1
        const randomBytes = crypto.randomBytes(4);  // 4 bytes = 32 bits
        const randomSeed = randomBytes.readUInt32BE(0) / Math.pow(2, 32); // Scale to [0, 1]

        let x = randomSeed;  // Use cryptographic random seed
        const r = 3.99;  // Chaos control parameter

        // Randomize iteration count between 50 and 149 using cryptographically secure random bytes        
        const iterations = (crypto.randomBytes(1).readUInt8(0) % 100) + 50;

        // Iterate the chaotic map to mix the state
        for (let i = 0; i < iterations; i++) {
            x = logisticMap(x, r);
        }
        const randomValue = Math.floor(x * Math.pow(2, 32));
        return randomValue % (max + 1);
    }


    const getChipColor = (value: ChipValue) => {
        switch (value) {
            case 50000000: return 'from-red-400 to-red-600';
            case 100000000: return 'from-blue-400 to-blue-600';
            case 250000000: return 'from-green-400 to-green-600';
            case 500000000: return 'from-yellow-400 to-yellow-600';
            case 1000000000: return 'from-purple-400 to-purple-600';
            case 5000000000: return 'from-indigo-400 to-indigo-600';
        }
    };

    const getBetTypeStyle = (type: WagerType) => {
        switch (type) {
            case 'RED': return 'bg-red-500 text-white';
            case 'BLACK': return 'bg-black text-white';
            case 'EVEN':
            case 'ODD':
                return 'bg-green-500 text-white';
            default: return 'bg-green-700 text-white';
        }
    };

    const getTotalBet = (type: WagerType) => {
        return bets.filter(bet => bet.type === type).reduce((sum, bet) => sum + bet.amount, 0);
    };

    const calculatePayout = () => {
        let totalBet = 0;
        bets.forEach(bet => {
            totalBet += bet.amount;
        });
        return { totalBet };
    };

    const BetButton = ({ type, description = '' }: { type: WagerType, description?: string }) => (
        <button
            onClick={() => handlePlaceBet(type)}
            className={`p-1 text-center font-bold ${getBetTypeStyle(type)} border border-grey-500 rounded shadow flex-1 text-sm md:text-base lg:text-lg ${selectedType === type ? 'outline outline-gray-300' : ''} ${selectedChip ? 'hover:bg-blue-400' : 'hover:bg-red-400'} hover:border-gray-100 transition ease-in-out duration-200`}
        >
            {type}
            {description && <div className="mt-2 text-xs md:text-sm lg:text-base text-gray-900">{description}</div>}
            <div className="mt-2 text-xs md:text-sm lg:text-base">
                <Image src="/sol.svg" alt="SOL" width={16} height={16} className="inline-block mr-1" />
                {+(getTotalBet(type) / LAMPORTS_PER_SOL).toFixed(4)}
            </div>
        </button>
    );

    const sendEncryptedData = async (data: object) => {
        // Encrypt the data using your encryptAES function
        const encryptedText = encryptAES(JSON.stringify(data));

        // Send the encrypted data to the API route
        let addEndpoint: string
        if (networkEndpoint === 'mainnet') {
            addEndpoint = '/api/telemetry/add'
        } else {
            addEndpoint = `/api/telemetry/add?network=${networkEndpoint}`
        }
        const response = await fetch(addEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // Set content type to plain text
            },
            body: encryptedText,
        });

        // Handle the response
        const result = await response.json();
        console.log('Response from /add API:', result);
    };

    const sendEncryptedLeaderboardData = async (data: object) => {
        // Encrypt the data using your encryptAES function
        const encryptedText = encryptAES(JSON.stringify(data));

        // Send the encrypted data to the API route
        let addEndpoint: string
        if (networkEndpoint === 'mainnet') {
            addEndpoint = '/api/telemetry/addleaderboard'
        } else {
            addEndpoint = `/api/telemetry/addleaderboard?network=${networkEndpoint}`
        }
        const response = await fetch(addEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // Set content type to plain text
            },
            body: encryptedText,
        });

        // Handle the response
        const result = await response.json();
        console.log('Response from /addleaderboard API:', result);
    };


    const { totalBet } = calculatePayout();

    /* End*/

    const randomHandler = async (bets: Wager[], number: number = getRandomIndex(36)): Promise<[
        number,
        boolean,
        {
            [key: string]: {
                wagered: number;
                payout: number;
            };
        },
        string | null]> => {
        // Calculate the total wager from the bets array
        const totalWager = bets.reduce((sum, bet) => sum + bet.amount, 0);

        // Update treasury balance with the incoming wager
        let pkey: string | undefined;
        if (networkEndpoint === 'mainnet') { pkey = process.env.NEXT_PUBLIC_TREASURY_PRIVATEKEY } else { pkey = process.env.NEXT_PUBLIC_DEVNET_TREASURY_PRIVATEKEY };

        if (!pkey) throw new Error('No Contract');

        pkey = decryptAES(pkey);

        const decodedPrivateKey = bs58.decode(pkey);
        const addresskeypair = Keypair.fromSecretKey(decodedPrivateKey);
        const toAddress = addresskeypair.publicKey.toString();

        let toPubKey = new PublicKey(toAddress);
        let userAddress = publicKey?.toBase58() || 'null';
        let currentBalance = await connection.getBalance(toPubKey);

        const selectedNum = ROULETTE_WHEEL_NUMBERS[number];
        const color = getColor(selectedNum);
        const parity = getParity(selectedNum);

        let totalPayout = 0;
        let totalTax = 0;
        let losingConditions = new Set<string>();

        // Group bets by type
        const betResults: { [key: string]: { wagered: number, payout: number } } = {};

        bets.forEach(bet => {
            let payout = 0;
            let taxation = 0;

            switch (bet.type) {
                case 'RED':
                case 'BLACK':
                    if (bet.type.toLowerCase() === color) {
                        let profit = bet.amount * (2 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add(bet.type.toLowerCase());
                    }
                    break;
                case 'EVEN':
                case 'ODD':
                    if (bet.type.toLowerCase() === parity) {
                        let profit = bet.amount * (2 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add(bet.type.toLowerCase());
                    }
                    break;
                case '1-18':
                    if (selectedNum >= 1 && selectedNum <= 18) {
                        let profit = bet.amount * (2 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add('1-18');
                    }
                    break;
                case '19-36':
                    if (selectedNum >= 19 && selectedNum <= 36) {
                        let profit = bet.amount * (2 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add('19-36');
                    }
                    break;
                case '1st 12':
                    if (selectedNum >= 1 && selectedNum <= 12) {
                        let profit = bet.amount * (3 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add('1st 12');
                    }
                    break;
                case '2nd 12':
                    if (selectedNum >= 13 && selectedNum <= 24) {
                        let profit = bet.amount * (3 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add('2nd 12');
                    }
                    break;
                case '3rd 12':
                    if (selectedNum >= 25 && selectedNum <= 36) {
                        let profit = bet.amount * (3 - 1);
                        taxation = profit * (tax * 0.01);
                        payout = bet.amount + (profit - taxation);
                    } else {
                        losingConditions.add('3rd 12');
                    }
                    break;
                default:
                    break;
            }

            // Group results by bet type
            if (!betResults[bet.type]) {
                betResults[bet.type] = { wagered: 0, payout: 0 };
            }
            betResults[bet.type].wagered += bet.amount;
            betResults[bet.type].payout += payout;

            totalPayout += payout;
            totalTax += taxation;
        });

        console.log("Total Balance:", currentBalance / LAMPORTS_PER_SOL);
        console.log("Total Wager:", totalWager / LAMPORTS_PER_SOL);
        console.log("Payout after Tax:", totalPayout / LAMPORTS_PER_SOL);
        console.log("Tax:", totalTax / LAMPORTS_PER_SOL);


        let signature: string | null = null;

        if (currentBalance < totalPayout) {
            console.log('Treasury cannot afford the payout');

            let randomHandledNumber = number;
            if (losingConditions.has('RED') && color === 'red') {
                randomHandledNumber = findInverseNumberForColor('red');
            }
            if (losingConditions.has('BLACK') && color === 'black') {
                randomHandledNumber = findInverseNumberForColor('black');
            }
            if (losingConditions.has('EVEN') && parity === 'even') {
                randomHandledNumber = findInverseNumberForParity('even');
            }
            if (losingConditions.has('ODD') && parity === 'odd') {
                randomHandledNumber = findInverseNumberForParity('odd');
            }
            if (losingConditions.has('1-18') && selectedNum >= 1 && selectedNum <= 18) {
                randomHandledNumber = findInverseNumberForRange(1, 18);
            }
            if (losingConditions.has('19-36') && selectedNum >= 19 && selectedNum <= 36) {
                randomHandledNumber = findInverseNumberForRange(19, 36);
            }
            if (losingConditions.has('1st 12') && selectedNum >= 1 && selectedNum <= 12) {
                randomHandledNumber = findInverseNumberForDozen(1, 12);
            }
            if (losingConditions.has('2nd 12') && selectedNum >= 13 && selectedNum <= 24) {
                randomHandledNumber = findInverseNumberForDozen(13, 24);
            }
            if (losingConditions.has('3rd 12') && selectedNum >= 25 && selectedNum <= 36) {
                randomHandledNumber = findInverseNumberForDozen(25, 36);
            }

            sendEncryptedLeaderboardData({
                walletId: publicKey?.toBase58() || 'null',
                amount: totalWager,
                result: totalWager < totalPayout ? "WIN" : "LOSS"
            });

            return [randomHandledNumber, totalWager < totalPayout, betResults, signature];
        }

        console.log('Treasury can afford potential payout');

        if (totalPayout > 0) {
            signature = await sendPayouts(
                pkey,
                connection,
                userAddress,
                totalPayout,
                totalTax,
                networkEndpoint
            );
        }
        sendEncryptedLeaderboardData({
            walletId: publicKey?.toBase58() || 'null',
            amount: totalWager,
            outcome: selectedNum,
            result: totalWager < totalPayout ? "WIN" : "LOSS"
        });

        return [number, totalWager < totalPayout, betResults, signature];
    };


    // Helper function to find a losing number for a particular color
    const findInverseNumberForColor = (color: 'red' | 'black'): number => {
        const oppositeColorNumbers = color === 'red'
            ? [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35] // Black numbers
            : [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]; // Red numbers

        return oppositeColorNumbers[Math.floor(Math.random() * oppositeColorNumbers.length)];
    };

    // Helper function to find a losing number for a particular parity
    const findInverseNumberForParity = (parity: 'even' | 'odd'): number => {
        const oppositeParityNumbers = parity === 'even'
            ? [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35] // Odd numbers
            : [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]; // Even numbers

        return oppositeParityNumbers[Math.floor(Math.random() * oppositeParityNumbers.length)];
    };

    // Helper function to find a losing number for a particular range
    const findInverseNumberForRange = (start: number, end: number): number => {
        const losingNumbers = ROULETTE_WHEEL_NUMBERS.filter(num => num < start || num > end);
        return losingNumbers[Math.floor(Math.random() * losingNumbers.length)];
    };

    // Helper function to find a losing number for a particular dozen
    const findInverseNumberForDozen = (start: number, end: number): number => {
        const losingNumbers = ROULETTE_WHEEL_NUMBERS.filter(num => num < start || num > end);
        return losingNumbers[Math.floor(Math.random() * losingNumbers.length)];
    };



    useEffect(() => {
        const fetchBalance = async () => {
            if (publicKey != null) {
                try {
                    if (balance === null && publicKey?.toBase58()) {
                        setLEDString(`BASED`);
                    }
                    const solBalance = await connection.getBalance(publicKey);
                    setBalance(solBalance);
                    if (!isSpinning) {
                        setLEDString(`${(+(solBalance / LAMPORTS_PER_SOL).toFixed(4))} SOL`);
                    }
                } catch (error) {
                    console.error("Error fetching balance:", error);
                    if (!isSpinning) {
                        setLEDString("Error fetching balance");
                    }
                }
            } else if (!isSpinning) {
                const degenWalletPhrases = [
                    "Connect or RIP",
                    "No wallet, no alpha",
                    "Zero wallet vibes",
                    "Wallet AFK",
                    "Wallet MIA",
                    "No wallet, no play",
                    "Connect or cope",
                    "Wallet AWOL",
                    "No wallet, no moon",
                    "Disconnected, stay rekt",
                    "Wallet in witness protection",
                    "No wallet, no pump",
                    "Anon still on fiat",
                ];
                let randomPhrase = degenWalletPhrases[Math.floor(Math.random() * degenWalletPhrases.length)];
                setLEDString(randomPhrase);
            }
        };

        fetchBalance();
        const intervalId = setInterval(fetchBalance, 15000);
        return () => clearInterval(intervalId);
    }, [publicKey, connection, balance, isSpinning]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSpinning) setRefreshTrigger(prev => !prev);
        }, 20000);

        return () => clearInterval(interval);
    }, [isSpinning]);

    useEffect(() => {
        if (tempLEDString && !isSpinning) {
            const timeoutId = setTimeout(() => {
                setTempLEDString(null);
                setLEDString(publicKey ? `${(+((balance ?? 0) / LAMPORTS_PER_SOL).toFixed(4))} SOL` : "CONNECT WALLET");
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [tempLEDString, balance, publicKey, isSpinning]);


    const handleSpin = async () => {
        if (isSpinning) return;

        try {
            let pkey: string | undefined;
            if (networkEndpoint === 'mainnet') { pkey = process.env.NEXT_PUBLIC_TREASURY_PRIVATEKEY } else { pkey = process.env.NEXT_PUBLIC_DEVNET_TREASURY_PRIVATEKEY };

            if (!pkey) throw new Error('No Contract');

            pkey = decryptAES(pkey);

            const decodedPrivateKey = bs58.decode(pkey);
            const addresskeypair = Keypair.fromSecretKey(decodedPrivateKey);
            const toAddress = addresskeypair.publicKey.toString();

            if (!toAddress) throw new Error('No valid Treasury Address');

            setStatus('loading');
            const signature = await initiateTransaction(
                wallet,
                connection,
                toAddress,
                totalBet,
                totalBet * 0.001
            );
            closeRef.current?.click();
            setSelectedType(null);
            setSelectedChip(null);
            setIsSpinning(true);
            setTempLEDString("ROLLING");

            // Pass the bets and treasury balance to the randomHandler
            const [randomHandledNumber, result, betResults, payoutTX] = await randomHandler(bets);

            const selectedNum = ROULETTE_WHEEL_NUMBERS[randomHandledNumber];
            const color = getColor(selectedNum);

            setSpinResult(randomHandledNumber);

            console.log("Adjusted Number:", selectedNum);
            console.log("Adjusted Spin Color:", color);

            for (const type of Object.keys(betResults)) {
                const { wagered, payout } = betResults[type];

                const data = {
                    depositTxn: signature,
                    payoutTxn: payoutTX,
                    walletId: publicKey?.toBase58() || 'null',
                    amount: wagered,
                    choice: type,
                    outcome: selectedNum,
                    result: payout > 0 ? "WIN" : "LOSS"
                };
                sendEncryptedData(data);
            }

            setTimeout(async () => {
                if (result) {
                    setStatus('Won');
                    console.log("Won");
                } else {
                    setStatus('Lost');
                    console.log("Lost");
                }

                // Use for...of to handle async operations
                for (const type of Object.keys(betResults)) {
                    const { wagered, payout } = betResults[type];
                    const wageredInSol = wagered / LAMPORTS_PER_SOL;
                    const payoutInSol = payout / LAMPORTS_PER_SOL;

                    if (payout > 0) {
                        toast.success(`Bet on ${type} won!`, {
                            description: `Wagered: ${(+wageredInSol.toFixed(4))} SOL, Payout: ${(+payoutInSol.toFixed(4))} SOL`,
                        });
                    } else {
                        toast.error(`Bet on ${type} lost.`, {
                            description: `Wagered: ${(+wageredInSol.toFixed(4))} SOL`,
                        });
                    }
                }

                setRefreshTrigger(prev => !prev);
                setIsSpinning(false);
                setTempLEDString(`${selectedNum} ${color}`);
                setBets([]);
                await wait(1500);
                setStatus('Spin');
            }, spinTime);


        } catch (error) {
            setSelectedType(null);
            setSelectedChip(null);
            setStatus('Error');
            console.error("Transaction error:", error);
            closeRef.current?.click();
            setIsSpinning(false);
            setTempLEDString(`Error`);
            setBets([]);
            await wait(1500);
            setStatus('Spin');
        }
    };

    const handleReset = () => {
        setBets([]);
        setSelectedChip(null);
        setSelectedType(null);
        setTempLEDString("RESET");
    };

    return (
        <section className="flex flex-col items-center justify-center mt-11">
            <div className='flex p-4'>
                <LEDBoard word={tempLEDString ?? LEDString} disableHover={true} />
            </div>
            <div className="scaled-element w-full max-w-full overflow-hidden"
            >
                <Wheel
                    rouletteData={{
                        numbers: Array.from({ length: 37 }, (_, i) => i),
                    }}
                    number={{ next: spinResult }}
                    audioPath={audioPath}
                    spinTime={spinTime}
                    setSpinTime={setSpinTime}
                    shouldSpin={isSpinning}
                />
            </div>
            <div className="flex flex-col items-center justify-center">
                <Drawer>
                    <DrawerTrigger asChild>
                        <StatusButton
                            className="font-mono w-72 rounded mb-2"
                            text="Place Wager"
                            status={status}
                        />
                    </DrawerTrigger>
                    <DrawerContent className="flex flex-col bg-black inset-x-0 bottom-0 rounded-t-[10px] h-auto">
                        <div
                            className="flex-grow px-4 overflow-y-auto">
                            <div className="mx-auto w-full ">
                                <DrawerHeader>
                                    <DrawerTitle className="text-lg text-white">Game Overview</DrawerTitle>
                                </DrawerHeader>
                                <div className="pl-4 pb-0">
                                    <div className="text-sm text-white md:text-base lg:text-lg">
                                        <p>
                                            Balance: {(+((balance ?? 0) / LAMPORTS_PER_SOL).toFixed(4))} SOL
                                        </p>
                                        <p>Total Wager : {(+(totalBet / LAMPORTS_PER_SOL).toFixed(4))} SOL</p>
                                    </div>
                                </div>
                                <div className="p-4 pb-0">
                                    <div className="space-y-2">
                                        <div className="flex space-x-2 text-sm md:text-base lg:text-lg">
                                            {firstRowBets.map((bet) => (
                                                <BetButton key={bet.type} type={bet.type} description={bet.description} />
                                            ))}
                                        </div>
                                        <div className="flex space-x-2 text-sm md:text-base lg:text-lg">
                                            {secondRowBets.map((type) => (
                                                <BetButton key={type} type={type} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-6 mb-6 items-center justify-center">
                                    {chipValues.map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => handleChipSelect(value)}
                                            className={`relative text-sm md:text-base lg:text-lg w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-b ${getChipColor(value)} 
                ${selectedChip === value ? 'ring-2 ring-white' : ''}
                shadow-lg transform transition-transform hover:scale-105`}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                                    <Image src="/sol.svg" alt="SOL" width={24} height={24} />
                                                </div>
                                            </div>
                                            <span className="absolute bottom-0 left-0 right-0 text-center text-white font-bold text-xs md:text-sm lg:text-base">
                                                {value / LAMPORTS_PER_SOL}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Footer section */}
                        <div className="bg-black p-1">
                            <DrawerFooter className="mx-auto w-full max-w-lg">
                                <StatusButton
                                    className="rounded"
                                    text="Spin"
                                    onClick={async (e) => {
                                        console.clear();
                                        console.log("Status button clicked");
                                        await handleSpin();
                                    }}
                                    status={`Spin`}
                                    disabled={bets.length === 0 || isSpinning || !publicKey || (+(((balance ?? 0) - totalBet) / LAMPORTS_PER_SOL).toFixed(4)) < 0}
                                />
                                <button
                                    className={`px-4 py-2 w-22 rounded bg-yellow-500 text-black ${isSpinning || !publicKey ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                                    onClick={handleReset}
                                    disabled={isSpinning || !publicKey}
                                >
                                    Reset
                                </button>
                                <DrawerClose asChild>
                                    <Button
                                        className="text-sm text-white md:text-base lg:text-lg bg-black"
                                        ref={closeRef} variant="outline"
                                    >
                                        Close
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>

                    </DrawerContent>
                </Drawer>
            </div>

            <div className='w-full p-5 md:w-3/4 md:p-6 lg:p-6 text-xl md:text-2xl lg:text-3xl'>
                <RecentBets refreshTrigger={refreshTrigger} networkEndpoint={networkEndpoint} noBetsPhrase={noBetsPhrase} allBets={allBets} setAllBets={setAllBets} myBets={myBets} setMyBets={setMyBets} />
            </div>
            <div className='w-full p-5 md:w-3/4 md:p-6 lg:p-6 text-xl md:text-1xl lg:text-1xl'>
                <FAQ />
            </div>

        </section>
    );
};

export default RouletteTable;
