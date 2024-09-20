import { VT323 } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import MainLayout from "@/app/MainLayout";
import { cx } from "class-variance-authority";
import { siteConfig } from "@/config/site";

const vt322 = VT323({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cx(
          "h-dvh fixed top-0 left-0 w-screen overflow-y-none !bg-background",
          `${vt322.className} flex flex-col min-h-screen`
        )}
      >
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}