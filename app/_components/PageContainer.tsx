import { motion } from 'framer-motion';
import { ReactNode } from "react";

const onTheRight = { x: '100%' }
const inTheCenter = { x: 0 }
const onTheLeft = { x: '-100%' }
const transition = { duration: 0.3, ease: 'easeInOut' }

export default function PageContainer({ children }: {
    children: ReactNode
}) {
    return (
        <motion.div
            initial={onTheRight}
            animate={inTheCenter}
            exit={onTheLeft}
            transition={transition}>
            {children}
        </motion.div>
    );
};
