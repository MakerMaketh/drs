import anime from "animejs";
import React, { useEffect, useRef } from "react";
import { rouletteData, WheelNumber } from "./Global";
import './styles.css'; // Import the stylesheet

const Wheel = (props: {
    rouletteData: rouletteData,
    number: WheelNumber,
    audioPath?: string, // Audio file path from props
    spinTime: number,
    shouldSpin: boolean,
    setSpinTime: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element => {
    const { rouletteData, number, audioPath, spinTime, shouldSpin, setSpinTime } = props;

    const lastSpinRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    let totalNumbers = 37;
    let singleRotationDegree = 360 / totalNumbers;
    let lastNumber = 0;

    let rouletteWheelNumbers = rouletteData.numbers;

    const getRouletteIndexFromNumber = (number: string) => {
        return rouletteWheelNumbers.indexOf(parseInt(number));
    };

    const nextNumber = (number: any) => {
        let value = number;
        return value;
    };

    const getRotationFromNumber = (number: string) => {
        let index = getRouletteIndexFromNumber(number);
        return singleRotationDegree * index;
    };

    const getRandomEndRotation = (minNumberOfSpins: number, maxNumberOfSpins: number) => {
        let rotateTo = anime.random(minNumberOfSpins * totalNumbers, maxNumberOfSpins * totalNumbers);
        return singleRotationDegree * rotateTo;
    };

    const getZeroEndRotation = (totalRotation: number) => {
        let rotation = 360 - Math.abs(totalRotation % 360);
        return rotation;
    };

    const getBallEndRotation = (zeroEndRotation: number, currentNumber: any) => {
        return Math.abs(zeroEndRotation) + getRotationFromNumber(currentNumber);
    };

    const getBallNumberOfRotations = (minNumberOfSpins: number, maxNumberOfSpins: number) => {
        let numberOfSpins = anime.random(minNumberOfSpins, maxNumberOfSpins);
        return 360 * numberOfSpins;
    };

    function spinWheel(number: number) {
        const bezier = [0.165, 0.84, 0.44, 1.005];
        let ballMinNumberOfSpins = 2;
        let ballMaxNumberOfSpins = 4;
        let wheelMinNumberOfSpins = 2;
        let wheelMaxNumberOfSpins = 4;

        let currentNumber = nextNumber(number);
        let lastNumberRotation = getRotationFromNumber(lastNumber.toString());

        let endRotation = -getRandomEndRotation(ballMinNumberOfSpins, ballMaxNumberOfSpins);
        let zeroFromEndRotation = getZeroEndRotation(endRotation);
        let ballEndRotation = getBallNumberOfRotations(wheelMinNumberOfSpins, wheelMaxNumberOfSpins) + getBallEndRotation(zeroFromEndRotation, currentNumber);

        anime.set([".layer-2", ".layer-4"], {
            rotate: function () {
                return lastNumberRotation;
            }
        });

        anime.set(".ball-container", {
            rotate: function () {
                return 0;
            }
        });

        // Start playing sound if audioPath is valid
        if (audioPath) {
            if (!audioRef.current) {
                audioRef.current = new Audio(audioPath);
            }
            const audio = audioRef.current;

            audio.onerror = () => {
                console.error("Failed to load audio from the path:", audioPath);
                audioRef.current = null;
            };

            if (audioRef.current) {
                audio.play().then(() => {
                    setSpinTime(audio.duration * 1000); // Update spinTime to audio duration in milliseconds
                });
                audio.onended = () => {
                    setSpinTime(spinTime); // Reset to original spinTime if audio ends
                };
            }
        }

        anime({
            targets: [".layer-2", ".layer-4"],
            rotate: function () {
                return endRotation;
            },
            duration: spinTime,
            easing: `cubicBezier(${bezier.join(",")})`,
            complete: function (anim: any) {
                lastNumber = currentNumber;
            }
        });

        anime({
            targets: ".ball-container",
            translateY: [
                { value: 0, duration: 2000 },
                { value: 20, duration: 1000 },
                { value: 25, duration: 900 },
                { value: 50, duration: 1000 }
            ],
            rotate: [{ value: ballEndRotation, duration: spinTime }],
            loop: 1,
            easing: `cubicBezier(${bezier.join(",")})`
        });
    }

    useEffect(() => {
        let nextNumber = number.next;
        if (shouldSpin && nextNumber != null && nextNumber !== "" && nextNumber !== lastSpinRef.current) {
            let nextNumberInt = parseInt(nextNumber);
            spinWheel(nextNumberInt);
            lastSpinRef.current = nextNumberInt;
        }
    }, [number, shouldSpin]);

    return (
        <div className="roulette-wheel">
            <div className="layer-2 wheel" style={{ transform: "rotate(0deg)" }}></div>
            <div className="layer-3"></div>
            <div className="layer-4 wheel" style={{ transform: "rotate(0deg)" }}></div>
            <div className="layer-5"></div>
            <div className="ball-container" style={{ transform: "rotate(0deg)" }}>
                <div className="ball" style={{ transform: "translate(0, -163.221px)" }}></div>
            </div>
        </div>
    );
};

export default Wheel;
