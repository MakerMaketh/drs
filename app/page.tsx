
import type { Metadata } from "next";
import HomeLayout from "@/app/game/Homepage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout() {
  let network: "mainnet" | "devnet" = 'mainnet';

  const degenNoBetsPhrases = [
    "Bets AWOL, vibes low",
    "Dry like the desert",
    "No degen, no fun",
    "Zero risk, zero reward",
    "Betless and restless",
    "Degens do, you dont",
    "Wager? Never heard of it",
    "Funds parked, action missing",
    "So empty, much cope",
    "Betting game weak",
    "An empty bet is sadder than fiat",
    "Nothing to flex here",
    "No bet, no moon",
    "Void of degen energy",
    "Funds frozen, bets too",
    "Risk appetite: zero",
    "Ghost town in here",
    "No gamble, no glory",
    "HODLing bets like regrets",
    "Degens bet, normies sit"
  ];
  let randomNoBetsPhrase = degenNoBetsPhrases[Math.floor(Math.random() * degenNoBetsPhrases.length)];

  return (
    <section className="flex flex-col h-full w-full bg-cover bg-center fixed inset-0 overflow-hidden">
      <HomeLayout networkEndpoint={network} noBetsPhrase={randomNoBetsPhrase} />
    </section>
  );
}
