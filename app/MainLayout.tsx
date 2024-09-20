"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "sonner";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="flex flex-col h-full w-full bg-cover bg-center fixed inset-0 overflow-hidden"
            style={{
                backgroundColor: `rgb(var(--dark-theme-bg-color))`,
            }}
            vaul-drawer-wrapper=""
        >
            {isLoading ? (
                <SplashScreen />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="flex flex-col h-full relative"
                >
                    <main>
                        {children}
                    </main>
                    <Toaster theme='dark' closeButton />
                </motion.div>
            )}
        </div>
    );
};

export default MainLayout;