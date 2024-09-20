import React from 'react';

export type WheelNumber = {
  next: any;
};

export type rouletteData = {
  numbers: number[];
};

export interface Bet {
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

export interface BetProps {
  noBetsPhrase?: string;
  refreshTrigger?: boolean;
  networkEndpoint: "mainnet" | "devnet";
  allBets: Bet[];
  myBets: Bet[];
  setAllBets: React.Dispatch<React.SetStateAction<Bet[]>>;
  setMyBets: React.Dispatch<React.SetStateAction<Bet[]>>;
}

export const getColor = (number: number) => {
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  if (RED_NUMBERS.includes(number)) return 'red';
  if (BLACK_NUMBERS.includes(number)) return 'black';
  return 'green';
};

export const ROULETTE_WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25,
  17, 34, 6, 27, 13, 36, 11,
  30, 8, 23, 10, 5, 24, 16, 33,
  1, 20, 14, 31, 9, 22, 18, 29,
  7, 28, 12, 35, 3, 26
];

export const getParity = (num: number) => {
  let res = num % 2 === 0;
  if (res) return "even";
  return "odd";
};