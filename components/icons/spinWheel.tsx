import React from 'react';

interface SpinWheelProps {
    className?: string; // Optional className prop
}

const SpinWheel: React.FC<SpinWheelProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 256 256"
        enableBackground="new 0 0 256 256"
        xmlSpace="preserve"
        style={{ width: '20%', height: '20%' }}
        className={className}
    >
        <g>
            <g>
                <path
                    fill="#ffffff"
                    d="M119.1,10.1c-16.6,1.5-31.2,5.6-45.6,13.1c-28,14.5-49.3,40.2-58.6,70.4c-3.6,11.7-4.9,20.6-4.9,34.2c0,11.1,0.3,14.6,2.3,24.7c2.6,12.8,9.5,29.3,16.9,40.5c28.7,43,80.6,62.4,130.2,48.8c20.1-5.5,38.3-16.4,53.2-31.7c35.5-36.6,43.6-91.2,20.1-136.3c-9.2-17.7-22.8-33-39.6-44.2c-6.1-4.1-17.9-10.1-24.8-12.6c-6.2-2.3-15.4-4.6-22.7-5.7C139.8,10.3,124.3,9.6,119.1,10.1z M142,31.9c10.8,1.6,19.6,4.4,29.3,9.3c9.7,4.9,17.6,10.6,25.2,18.2C215,78,224.8,101.8,224.8,128c0,21.7-6.6,41.5-19.9,59c-10.3,13.6-26,25.4-42.5,31.7c-5.7,2.2-15.4,4.6-21.9,5.5c-6.8,0.9-18.5,0.9-25.2,0c-17.4-2.3-34.2-9.4-48.1-20.4c-4.2-3.3-11.8-10.9-15.1-15.1c-8.9-11.3-15.8-25.6-18.8-39c-3.1-13.9-3.1-29.4,0-43.4c3-13.3,10-27.8,18.8-39C67.2,48.5,89.3,35.7,113.3,32C121.2,30.8,134,30.8,142,31.9z"
                />
                <path
                    fill="#ffffff"
                    d="M121,35.5c-0.6,0.2-0.6,1.5,0.3,12.3c0.6,6.6,1,12.4,1.1,12.6c0,0.5,1.4,0.6,5.5,0.6s5.5-0.1,5.5-0.6c0-0.3,0.5-6,1.1-12.6l1.1-12.1l-1-0.2C133.5,35.2,122,35.2,121,35.5z"
                />
                <path
                    fill="#ffffff"
                    d="M98.6,40.1c-3.3,1.2-6.4,2.2-6.8,2.4c-0.5,0.1-0.8,0.5-0.8,0.8c0,0.3,2.2,5.6,4.9,11.9c3.9,9,5.1,11.4,5.7,11.1c0.4-0.1,2.6-1,5-1.8c2.4-0.8,4.4-1.6,4.5-1.7c0.3-0.3-5.9-24.8-6.2-24.8C104.7,38,101.9,39,98.6,40.1z"
                />
                <path
                    fill="#ffffff"
                    d="M147.5,50.3c-1.7,6.8-3,12.4-2.9,12.5c0.1,0.1,2.1,0.9,4.5,1.7c2.4,0.8,4.6,1.7,5,1.8c0.6,0.2,1.8-2.3,5.8-11.4l5.2-11.8l-1.7-0.7c-2.2-0.9-10.1-3.6-11.6-4l-1.2-0.3L147.5,50.3z"
                />
                <path
                    fill="#ffffff"
                    d="M73.1,53.1c-2,1.5-4.6,3.6-5.8,4.8l-2.2,2l8.5,9.2c4.7,5.1,8.6,9.2,8.7,9.2c0.1,0,1.8-1.2,3.6-2.6c1.8-1.5,3.8-3,4.2-3.3c0.9-0.6,0.6-1.2-6-11.3c-3.8-5.9-7-10.7-7.2-10.7C76.9,50.4,75.2,51.6,73.1,53.1z"
                />
                <path
                    fill="#ffffff"
                    d="M171.5,61.2l-6.9,10.7l1.3,1c0.7,0.6,2.4,1.8,3.6,2.8c1.2,1,2.6,2.1,3,2.4c0.7,0.5,1.9-0.6,9.4-8.8l8.6-9.3l-2.1-2c-2.3-2.1-9.4-7.5-9.8-7.5C178.6,50.5,175.3,55.3,171.5,61.2z"
                />
                <path
                    fill="#ffffff"
                    d="M118.2,66.4c-26.8,4.2-47.9,25.5-51.9,52.4c-4.1,26.8,10,53.4,34.6,65.4c9.4,4.5,18.4,6.4,29.1,6c3.6-0.1,8.1-0.6,10.2-1c24.6-5.1,43.8-24.3,48.9-48.9c1.2-5.4,1.4-15.6,0.5-21.2c-4.2-27.3-25.3-48.5-52.4-52.6C131.8,65.5,123.5,65.5,118.2,66.4z M137.8,87.6c15,4.1,25.6,14.3,30.1,29.2c1.2,3.7,1.3,4.8,1.3,11.3c0,6.5-0.1,7.6-1.2,11.2c-4.4,14.3-14.5,24.4-28.8,28.8c-3.6,1.1-4.8,1.2-11.2,1.2s-7.6-0.1-11.2-1.2c-18.4-5.6-30.3-21.4-30.3-40.3c0-16.9,11.2-32.9,27.2-38.7c5.8-2.1,8.9-2.5,15.5-2.3C132.5,86.8,136.2,87.1,137.8,87.6z"
                />
                <path
                    fill="#ffffff"
                    d="M133.8,98.7c-2.6,1.4-3.4,5.2-1.8,7.9c0.8,1.3,0.8,1.7,0.3,3c-0.3,0.8-1,2.5-1.4,3.7l-0.8,2.2h-2.6c-3.4,0-6.6,1.5-9,4.1l-1.8,1.9l-3.6-1.3c-3.4-1.2-3.6-1.4-4.1-3c-1.8-5.7-10.2-4.9-11,1c-0.6,3.9,2.4,6.9,6.3,6.3c1.1-0.1,2.4-0.6,2.8-1c0.7-0.6,1-0.7,2.4-0.1c0.9,0.4,2.5,1,3.8,1.4l2.2,0.8v2.6c0,3.4,1.5,6.6,4.1,9l2,1.8l-1.3,3.6c-1,3-1.4,3.7-2.4,3.9c-2,0.5-3.3,1.7-4,3.6c-0.6,1.6-0.6,2.2-0.1,3.7c1.5,4.5,8.2,5.3,10.3,1.2c0.9-1.7,0.9-4.6,0-5.8c-0.9-1.2-0.9-1.8,0.5-5.6l1.2-3.3h2.6c3.3,0,6.6-1.5,9-4.1l1.8-2l3.7,1.3c3.2,1.1,3.7,1.4,4.1,2.7c1,3,4.3,4.8,7.1,3.9c2.5-0.8,4-2.9,4-5.6c0-2-0.2-2.5-1.6-3.9s-1.9-1.6-3.9-1.6c-1.5,0-2.6,0.3-3.4,0.9c-1.1,0.8-1.2,0.8-4.9-0.6l-3.8-1.4v-2.6c0-3.3-1.5-6.6-4.1-9l-1.9-1.8l1.3-3.7c1.2-3.3,1.4-3.7,2.6-4c1.8-0.4,3.9-2.6,4.3-4.6c0.6-3.4-2.1-6.6-5.5-6.6C135.9,98,134.5,98.3,133.8,98.7z M129.5,121.2c0.7,1.2-0.1,2.4-2.1,2.8c-1.8,0.4-3.6,2.3-3.6,3.8c0,2-2.3,2.8-3.4,1.2c-1.2-1.9,1.4-6.7,4.5-8.1C126.7,120,128.8,120.1,129.5,121.2z"
                />
                <path
                    fill="#ffffff"
                    d="M52.7,73.7c-2.3,3.1-6,9.2-6,9.9c0,0.2,5,3.2,11.1,6.5l11.1,6l1-1.7c0.6-0.9,1.9-3,3-4.7c1.1-1.6,1.8-3.1,1.6-3.3c-1.1-1-19.6-15.2-19.8-15.2C54.6,71.2,53.7,72.3,52.7,73.7z"
                />
                <path
                    fill="#ffffff"
                    d="M191.8,78.2c-4.8,3.8-9.3,7.3-9.9,7.8l-1.2,0.8l1.6,2.3c0.9,1.2,2.2,3.2,2.9,4.4c0.7,1.2,1.5,2.2,1.8,2.2c0.8,0,22.1-11.6,22.1-12.1c0-1.1-7.2-12-8.1-12.2C200.8,71.4,196.7,74.4,191.8,78.2z"
                />
                <path
                    fill="#ffffff"
                    d="M39.7,99.2c-0.6,1.8-2.5,9.2-3,11.5c-0.3,1.8-0.2,1.9,1,2.2c3,0.6,23.8,4,23.9,3.9c0.5-0.7,2.5-10.3,2.2-10.6c-0.3-0.2-23-8.2-23.5-8.2C40.2,98,40,98.5,39.7,99.2z"
                />
                <path
                    fill="#ffffff"
                    d="M203.3,102c-6.3,2.2-11.6,4-11.7,4.1c-0.1,0.1,2.3,10.3,2.5,10.7c0.1,0.2,24.7-4,25-4.2c0.6-0.6-3-14.2-3.8-14.4C215.1,98.1,209.7,99.8,203.3,102z"
                />
                <path
                    fill="#ffffff"
                    d="M35.1,130.5c0,3.4,0.9,11.9,1.3,12.4c0.3,0.3,18-2.4,24.1-3.6c1.1-0.2,1.2-0.3,0.8-2.6c-0.2-1.3-0.4-3.8-0.4-5.5l0-3.1H48H35.1V130.5z"
                />
                <path
                    fill="#ffffff"
                    d="M194.8,131.1c0,1.8-0.2,4.2-0.4,5.4c-0.2,1.2-0.3,2.4-0.3,2.4c0.3,0.4,25,4.2,25.3,3.9c0.4-0.4,1.3-9.4,1.3-12.6V128h-12.9h-12.9L194.8,131.1z"
                />
                <path
                    fill="#ffffff"
                    d="M52.4,153.9c-6.6,2.3-12,4.2-12.1,4.3c-0.2,0.2,2.6,7.1,4.4,10.6l1.8,3.4l10.8-6c6-3.2,11-6,11.3-6.1c0.2,0,0-0.8-0.4-1.7c-0.5-0.9-1.5-3.2-2.3-5.1l-1.4-3.5L52.4,153.9z"
                />
                <path
                    fill="#ffffff"
                    d="M189.2,154.8l-2.2,5.1l1,0.6c1.8,1.2,20.9,11.4,21.2,11.4c0.7,0,6.6-13.2,6.1-13.7c-0.1-0.1-5.3-1.9-11.4-4.1c-6.2-2.1-11.6-4-12-4.1C191.5,149.8,190.8,151,189.2,154.8z"
                />
                <path
                    fill="#ffffff"
                    d="M57.2,169c-1,1-1.3,1.8-1.3,3c0,2.1,2.1,4.4,3.9,4.4c2.9,0,5.3-2.7,4.7-5.4C63.6,167.7,59.7,166.6,57.2,169z"
                />
                <path
                    fill="#ffffff"
                    d="M180.4,169.5c0,0.3-1.7,2.1-3.6,4.2l-3.4,3.7l1.6,1.7c0.9,0.9,4.2,4.6,7.5,8.2c3.2,3.6,6.4,6.9,6.9,7.5c0.6,0.7,1.2,0.9,1.8,0.7c0.9-0.4,9.5-9.9,9.5-10.6c0-0.3-3.6-3.3-8.1-6.7C181,169.3,180.6,169,180.4,169.5z"
                />
                <path
                    fill="#ffffff"
                    d="M64.8,177.2c-5.4,4.2-9.8,7.8-9.8,7.9c0,0.6,9.3,10.7,9.9,10.7c0.5,0,12.4-12.5,16.6-17.4c0.8-1,0.8-1-2.7-5c-2-2.2-3.7-3.9-3.9-3.9S70.1,173,64.8,177.2z"
                />
                <path
                    fill="#ffffff"
                    d="M84.5,194.5c-3.7,5.6-6.7,10.5-6.8,10.8c-0.1,0.3,1.1,1.3,2.5,2.2c3.1,1.9,10.3,5.5,10.5,5.3c0-0.1,2.3-5,4.8-11c2.6-6,4.9-11.2,5.1-11.6c0.4-0.6,0-1-1.7-1.7c-1.2-0.6-3.3-1.7-4.8-2.6c-1.5-0.9-2.7-1.6-2.9-1.6C91.2,184.3,88.1,188.9,84.5,194.5z"
                />
                <path
                    fill="#ffffff"
                    d="M160.2,186.6c-2.1,1.2-4.2,2.3-4.5,2.3s-0.6,0.2-0.6,0.5c0,0.4,9.4,22.1,10,23.2c0.2,0.4,10.5-4.8,12.2-6.3l1.2-1l-6.8-10.4c-3.8-5.7-7-10.4-7.2-10.5C164.3,184.4,162.4,185.4,160.2,186.6z"
                />
                <path
                    fill="#ffffff"
                    d="M108.4,205.3c-1.8,6.7-3,12.4-2.9,12.5c0.4,0.4,8.2,1.9,11.6,2.2l3.2,0.3l1.1-12.6c0.6-6.9,0.9-12.7,0.8-12.8c-0.1-0.1-2.1-0.6-4.4-0.9c-2.3-0.3-4.6-0.7-5.2-0.9C111.5,193,111.5,193.2,108.4,205.3z"
                />
                <path
                    fill="#ffffff"
                    d="M138.5,194c-2.6,0.5-4.8,0.9-4.9,1c-0.1,0.1,1.9,24.3,2.1,25.2c0.1,0.5,14-1.8,14.7-2.4c0.2-0.3-1.5-7.7-4.6-19.4c-0.8-3-1.7-5.4-1.9-5.4C143.6,193.2,141.2,193.6,138.5,194z"
                />
            </g>
        </g>
    </svg>
);

export default SpinWheel;
