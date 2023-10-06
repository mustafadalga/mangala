import Stone from "./Stone";
import { useEffect, useState } from "react";
import { generatePositionsForStones } from "@/_utilities";
import { Position, PositionThreshold } from "@/_types";

function initialThreshold(): PositionThreshold {
    if (window.innerWidth >= 1024) {  // This is just an example breakpoint for a tablet
        return {
            minLeft: 10,
            minTop: 15,
            maxLeft: 70,
            maxTop: 80
        }
    } else {
        return {
            minLeft: 5,
            minTop: 10,
            maxLeft: 90,
            maxTop: 70
        }
    }
}

export default function Treasure({ treasure }: { treasure: number }) {
    const [ positions, setPositions ] = useState<Position[]>([]);
    const [ currentThreshold, setCurrentThreshold ] = useState<PositionThreshold>(initialThreshold());

    useEffect(() => {
        const handleResize = () => {
            const newThreshold = initialThreshold();

            if (JSON.stringify(newThreshold) === JSON.stringify(currentThreshold)) return;
            setCurrentThreshold(initialThreshold());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentThreshold]);

    useEffect(() => {
        const usedPositions = generatePositionsForStones(treasure, currentThreshold);
        setPositions(usedPositions);

    }, [ treasure, currentThreshold ]);

    return (
        <div
            className="backdrop-lg p-8 h-20 sm:h-24 w-full lg:w-40 lg:h-96 grid grid-cols-3 gap-1 place-items-center rounded-[8rem] backdrop-blur-xl bg-white/25 border border-white">
            {positions.map((position, index: number) => (
                <Stone key={index} position={position}/>
            ))}
        </div>
    );
};