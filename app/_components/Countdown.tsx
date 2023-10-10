import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
    initialSeconds: number,
    endSeconds: number,
    pause: boolean,
    className?: string,
    onComplete: () => void
}

export default function Countdown({ initialSeconds, endSeconds, pause, className, onComplete }: Props) {
    const [ percentage, setPercentage ] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | number | null>(null);
    const elapsedSecondsRef = useRef(0);

    const handleReset = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        elapsedSecondsRef.current = 0;
        setPercentage(0);
    }, []);

    useEffect(() => {
        handleReset();

        if (pause) return;

        elapsedSecondsRef.current = initialSeconds;

        intervalRef.current = setInterval(() => {
            elapsedSecondsRef.current += 0.1;
            const newPercentage = (elapsedSecondsRef.current / endSeconds) * 100;
            setPercentage(newPercentage);

            if (elapsedSecondsRef.current >= endSeconds) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                onComplete();
            }
        }, 100);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        };
    }, [ pause, initialSeconds ]);

    const progressBarStyle = {
        background: `conic-gradient(rgb(220 38 38) 0% ${percentage}%, transparent ${percentage}%)`
    };
    return (
        <div className={`${className} relative h-16 w-16 sm:h-20 sm:w-20 border rounded-full`}>
            <div className="w-full h-full rounded-full" style={progressBarStyle}></div>
        </div>
    );
};