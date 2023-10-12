import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
    initialSeconds: number,
    endSeconds: number,
    pause: boolean,
    className?: string,
    onComplete: () => void
}

/**
 * Countdown component that displays a visual countdown timer.
 *
 * @param initialSeconds - The starting point for the countdown in seconds.
 * @param endSeconds - The end point for the countdown in seconds.
 * @param pause - If `true`, the countdown will be paused.
 * @param className - Optional CSS class to style the component.
 * @param onComplete - Callback to be called when the countdown reaches the end.
 * @returns The rendered Countdown component.
 */
export default function Countdown({ initialSeconds, endSeconds, pause, className, onComplete }: Props) {
    const [ percentage, setPercentage ] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | number | null>(null);
    const elapsedSecondsRef = useRef(0);

    /**
     * Resets the countdown timer.
     * Clears the interval, resets the elapsed seconds, and sets the percentage to 0.
     */
    const handleReset = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        elapsedSecondsRef.current = 0;
        setPercentage(0);
    }, []);

    /**
     * Effect hook to manage the countdown timer's state.
     * Resets the countdown on mount and updates the countdown every 100 milliseconds if not paused.
     * Clears the interval on unmount.
     */
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

    /**
     * Inline style for the countdown progress bar.
     * Represents the visual progress of the countdown timer using a conic-gradient.
     */
    const progressBarStyle = {
        background: `conic-gradient(rgb(239 68 68) 0% ${percentage}%, transparent ${percentage}%)`
    };
    return (
        <div className={`${className} h-12 w-12 sm:h-16 sm:w-16 border rounded-full transition-all duration-700`}>
            <div className="w-full h-full rounded-full" style={progressBarStyle}></div>
        </div>
    );
};