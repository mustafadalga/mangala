import { memo } from "react";
import { motion } from 'framer-motion';
import { StoneWithPosition } from "@/_types";

interface Props {
    stone: StoneWithPosition
}

const stoneVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
};

const Stone = ({ stone: { stone: { color }, position: { left, top } } }: Props) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={stoneVariants}
        >
            <div
                style={{ left: `${left}%`, top: `${top}%` }}
                className={`${color} absolute w-3 h-3  xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full border border-solid border-white shadow-[5px_5px_15px_rgba(0,0,0,0.3),inset_2px_2px_5px_rgba(255,255,255,0.1),inset_-2px_-2px_5px_rgba(0,0,0,0.4)]`}></div>
        </motion.div>
    );
};

export default memo(Stone)