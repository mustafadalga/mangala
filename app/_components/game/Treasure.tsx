import { memo } from "react";
import { AnimatePresence } from 'framer-motion';
import getTreasureThresholdByWindowSize from "@/_utilities/getTreasureThresholdByWindowSize";
import usePositionManagement from "@/_hooks/usePositionManagement";
import { Stone as IStone, StoneWithPosition } from "@/_types";
import Stone from "./Stone";

const Treasure = ({ treasure, className }: { treasure: IStone[], className?: string }) => {
    const stones: StoneWithPosition[] = usePositionManagement(getTreasureThresholdByWindowSize, treasure);

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