import React from 'react';
import Image from 'next/image';

interface SOLButtonProps {
    text: string;
    svgUrl?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const SOLButton: React.FC<SOLButtonProps> = ({ text, svgUrl, onClick, className = '', disabled = false }) => {
    // Default SVG URL if none is provided
    const defaultSvgUrl = "/sol.svg";

    return (
        <button
            className={`flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800 transition ${className} 
            ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-black' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="text-sm">{text}</span>
            <Image
                src={svgUrl || defaultSvgUrl}
                alt={text}
                width={20}
                height={20}
                className="h-5 w-5"
            />
        </button>
    );
};

export default SOLButton;
