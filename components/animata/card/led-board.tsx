import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const charMap: Record<string, number[][]> = {
    A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    B: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
    ],
    C: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    D: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
    ],
    E: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
    ],
    F: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
    ],
    G: [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 1],
    ],
    H: [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
    ],
    I: [
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
    ],
    J: [
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 1],
    ],
    K: [
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
    ],
    L: [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
    ],
    M: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    N: [
        [1, 0, 0, 1],
        [1, 1, 0, 1],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
    ],
    O: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    P: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
    ],
    Q: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 1],
    ],
    R: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1],
    ],
    S: [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
    ],
    T: [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    U: [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 1],
    ],
    V: [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
    ],
    W: [
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 1, 1],
    ],
    X: [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
    ],
    Y: [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    Z: [
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
    ],
    ".": [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    ',': [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
    ],
    "?": [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 1, 1, 0],
        [1, 1, 0, 0, 0, 1, 1],
        [0, 0, 1, 1, 1, 0, 0],
        [1, 1, 0, 0, 0, 1, 1],
        [0, 1, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
    ],
    "+": [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ],
    "-": [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    " ": [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ],
    0: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    1: [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
    ],
    3: [
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    2: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    4: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
    ],
    5: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    6: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    7: [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    8: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    9: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
    ],
};


function createMatrix(rows: number, cols: number) {
    return Array(rows).fill("").map(() => Array(cols).fill(false));
}

interface Board {
    rows: number;
    cols: number;
    matrix: boolean[][];
}

function createBoard(word: string) {
    const rows = 15;
    const wordArray = word.trim().toUpperCase().split("");
    const cols = wordArray
        .map((char) => (charMap[char] || charMap[" "])[0].length + 1)
        .reduce((a, b) => a + b, 1) * 2;

    const matrix = createMatrix(rows, cols);
    const startRow = 2;
    let startCol = 2;

    for (const char of wordArray) {
        const charPattern = charMap[char] || charMap[" "];
        for (let rowIndex = 0; rowIndex < charPattern.length; rowIndex++) {
            for (let colIndex = 0; colIndex < charPattern[rowIndex].length; colIndex++) {
                if (charPattern[rowIndex][colIndex]) {
                    matrix[startRow + rowIndex * 2][startCol + colIndex * 2] = true;
                }
            }
        }
        startCol += (charPattern[0].length + 1) * 2;
    }

    return { rows, cols, matrix };
}

interface LEDBoardProps {
    word: string;
    disableHover?: boolean;
    onClick?: () => void;
    size?: 'small' | 'medium' | 'large';
}


export default function LEDBoard({
    word = "COPY",
    disableHover = false,
    onClick,
    size
}: LEDBoardProps) {
    const [{ rows, cols, matrix }, setBoard] = useState<Board>(createBoard(word));
    const [isHovering, setIsHovering] = useState(false);
    const [, setForceUpdate] = useState(0);

    useEffect(() => setBoard(createBoard(word)), [word]);

    useEffect(() => {
        if (isHovering && !disableHover) return;

        const interval = setInterval(() => {
            setForceUpdate((current) => current + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [isHovering, disableHover]);

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (onClick) {
            onClick();
        }
    };

    const sizeClasses = {
        small: "h-16 w-64",
        medium: "h-24 w-96",
        large: "h-32 w-128"
    };

    return (
        <div
            className={cn(
                "group rounded-xl border border-gray-600 bg-gradient-to-bl from-zinc-950/80 via-zinc-900 via-30% to-zinc-950 to-75% p-4 dark:border-zinc-800",
                size ? `${sizeClasses[size]}` : "led-element h-16 w-80",
                onClick ? "cursor-pointer" : ""
            )}
            onMouseEnter={() => !disableHover && setIsHovering(true)}
            onMouseLeave={() => !disableHover && setIsHovering(false)}
            onClick={handleClick}
        >
            <div className="h-full w-full flex items-center justify-center">
                <svg className="h-full w-auto text-zinc-800" viewBox={`0 0 ${cols - 1} ${rows}`} preserveAspectRatio="xMidYMid meet">
                    {matrix.map((row, rowIndex) =>
                        row.map((isLit, colIndex) => {
                            if (rowIndex % 2 === 1 || colIndex % 2 === 1) return null;

                            const shouldAnimate = !isHovering && !disableHover && isLit && Math.random() > 0.8;
                            const delay = shouldAnimate ? Math.floor(Math.random() * 1000) : 0;

                            return (
                                <circle
                                    key={`${rowIndex}-${colIndex}`}
                                    cx={colIndex + 0.25}
                                    cy={rowIndex + 0.25}
                                    r={0.25}
                                    style={{
                                        transitionDelay: (!isHovering && !disableHover) ? `${colIndex * 15}ms` : "0ms",
                                        animationDuration: "2000ms",
                                        animationDelay: `${delay}ms`,
                                    }}
                                    className={cn("fill-zinc-800 transition-all duration-200 ease-in-out", {
                                        "group-hover:fill-white": isLit && !disableHover,
                                        "fill-white": isLit && disableHover,
                                        "animate-led": shouldAnimate,
                                    })}
                                />
                            );
                        })
                    )}
                </svg>
            </div>
        </div>
    );
}