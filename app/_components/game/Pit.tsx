import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {  AnimatePresence } from 'framer-motion';
import { isEqual } from "lodash"
import generatePositionsForStones from "@/_utilities/generatePositionsForStones";
import { Pit as IPit, PositionThreshold } from "@/_types";
import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import getPitThresholdByWindowSize from "@/_utilities/getPitThresholdByWindowSize";
import Stone from "./Stone";

interface Props {
    pit: IPit,
    hasRight: boolean,
    onClick: () => void
}


const Pit = ({ pit, hasRight, onClick }: Props) => {
    const className = hasRight ? "cursor-pointer bg-green-700/50 border-green-500" : "backdrop-blur-xl bg-white/25 border-white"
    const [ currentThreshold, setCurrentThreshold ] = useState<PositionThreshold>(getPitThresholdByWindowSize());
    const [ stonesWithPosition, setStonesWithPosition ] = useState(() => generatePositionsForStones(currentThreshold));
    const memorizedPit = useDeepCompareMemoize<IPit>(pit);

    const stones = useMemo(() => memorizedPit.map((stone) => ({
        stone,
        position: stonesWithPosition[stone.no - 1],
    })), [ memorizedPit, stonesWithPosition ]);

    const handleResize = useCallback(() => {
        const newThreshold = getPitThresholdByWindowSize();

        if (!isEqual(currentThreshold, newThreshold)) {
            setCurrentThreshold(newThreshold);
            setStonesWithPosition(generatePositionsForStones(newThreshold));

        }
    }, [ currentThreshold ]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            onClick={onClick}
            className={`${className} relative rounded-full w-10 h-10 xs:w-12 xs:h-12  sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 p-2 lg:p-4 border`}>
            <AnimatePresence>
                {stones.map(stone => (
                    <Stone key={stone.stone.no} stone={stone} />
                ))}
            </AnimatePresence>
        </div>
    );
};


export default memo(Pit)