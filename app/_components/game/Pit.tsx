import { memo } from "react";
import { AnimatePresence } from 'framer-motion';
import { Pit as IPit, StoneWithPosition } from "@/_types";
import getPitThresholdByWindowSize from "@/_utilities/getPitThresholdByWindowSize";
import usePositionManagement from "@/_hooks/usePositionManagement";
import Stone from "./Stone";


interface Props {
    pit: IPit,
    hasRight: boolean,
    onClick: () => void
}

const Pit = ({ pit, hasRight, onClick }: Props) => {
    const className = hasRight ? "cursor-pointer bg-green-700/50 border-green-500" : "bg-indigo-800/50 border-white"
    const stones: StoneWithPosition[] = usePositionManagement(getPitThresholdByWindowSize, pit);

    return (
        <div
            onClick={onClick}
            className={`${className} relative rounded-full w-10 h-10 xs:w-12 xs:h-12  sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 p-2 lg:p-4 border`}>
            <AnimatePresence>
                {stones.map(stone => (
                    <Stone key={stone.stone.no} stone={stone}/>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default memo(Pit)