import React from 'react';
import { getColor} from '@/app/game/Global';

const DynamicIcon = ({ number }: { number: number }) => {
    const backgroundColor = getColor(number);

    return (
        <div className="w-full relative overflow-hidden rounded">
            <div
                className={`${backgroundColor === 'red' ? 'bg-red-600' :
                    backgroundColor === 'green' ? 'bg-green-600' :
                        'bg-black'
                    }`}
            >
                <div className="flex items-center justify-center relative rounded border border-gray-500">
                    <div className="absolute inset-0 rounded bg-gradient-radial from-transparent via-black/10 to-black/30" />
                    <span className="text-[80%] sm:text-[80%] md:text-[90%] lg:text-[120%] font-bold text-yellow-400 z-10 drop-shadow-lg">
                        {number}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DynamicIcon;