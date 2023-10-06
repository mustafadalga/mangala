import Stone from "./Stone";
import { memo, useEffect, useState } from "react";
import { generatePositionsForStones } from "@/_utilities";
import { Position, PositionThreshold } from "@/_types";

interface Props {
    pit: number
    hasRight: boolean,
    onClick: () => void
}


function initialThreshold(): PositionThreshold {
    if (window.innerWidth >= 1024) {  // This is just an example breakpoint for a tablet
        return {
            minLeft: 25,
            minTop: 5,
            maxLeft: 60,
            maxTop: 60
        }
    } else if (window.innerWidth >= 768) {
        return {
            minLeft: 10,
            minTop: 15,
            maxLeft: 55,
            maxTop: 50
        }
    } else if (window.innerWidth >= 640) {
        return {
            minLeft: 10,
            minTop: 20,
            maxLeft: 55,
            maxTop: 50
        }
    } else {
        return {
            minLeft: 20,
            minTop: 10,
            maxLeft: 55,
            maxTop: 60
        }
    }
}


const Pit = ({ pit, hasRight, onClick }: Props) => {
    const [ positions, setPositions ] = useState<Position[]>([]);
    const className = hasRight ? "cursor-pointer bg-green-700/50 border-green-500" : "backdrop-blur-xl bg-white/25 border-white"
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
    }, [ currentThreshold ]);

    useEffect(() => {
        const usedPositions = generatePositionsForStones(pit, currentThreshold);
        setPositions(usedPositions)
    }, [ pit, currentThreshold ]);

    return (
        <div
            onClick={onClick}
            className={`${className} relative rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 p-2 lg:p-4 border`}>
            {positions.map((position, index) => (
                <Stone key={index}
                       hasRight={hasRight}
                       position={position}/>
            ))}
        </div>
    );
};

export default memo(Pit)