import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { AnimatePresence } from 'framer-motion';
import generatePositionsForStones from "@/_utilities/generatePositionsForStones";
import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import getTreasureThresholdByWindowSize from "@/_utilities/getTreasureThresholdByWindowSize";
import { PositionThreshold, Stone as IStone } from "@/_types";
import Stone from "./Stone";


const Treasure = ({ treasure, className }: { treasure: IStone[], className?: string }) => {
    const [ currentThreshold, setCurrentThreshold ] = useState<PositionThreshold>(getTreasureThresholdByWindowSize());
    const [ stonesWithPosition, setStonesWithPosition ] = useState(() => generatePositionsForStones(currentThreshold));
    const memorizedTreasure = useDeepCompareMemoize<IStone[]>(treasure)

    const stones = useMemo(() => memorizedTreasure.map((stone) => ({
        stone,
        position: stonesWithPosition[stone.no - 1]
    })), [ memorizedTreasure, stonesWithPosition ]);

    const handleResize = useCallback(() => {
        const newThreshold = getTreasureThresholdByWindowSize();

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
            className={`${className} backdrop-lg p-3 h-14 xs:h-16 sm:h-20 w-full lg:w-40 lg:h-96  grid content-center justify-normal lg:content-baseline lg:justify-center rounded-[8rem] backdrop-blur-xl bg-white/25 border border-white`}>
            <AnimatePresence>
                {stones.map((stone) => <Stone stone={stone} key={stone.stone.no}/>)}
            </AnimatePresence>
        </div>
    );
};

export default memo(Treasure)