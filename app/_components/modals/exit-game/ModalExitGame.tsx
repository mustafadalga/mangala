import { motion } from 'framer-motion';
import { backdropVariants, modalVariants } from "@/_constants";
import ButtonGroup from "./ButtonGroup";

export default function ModalExitGame() {
    return (
        <motion.section
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed bg-neutral-800/70 grid place-items-center inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-full w-full">

            <motion.div initial="enter"
                        animate="center"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white rounded-lg shadow mx-auto max-w-3xl w-full">
                <div
                    className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5 w-full rounded-xl shadow-[0px_0px_5px_0px_#7e22ce]">


                    <h1 className="mt-5 font-semibold text-2xl lg:text-3xl xl:text-4xl text-purple-600">Exit Game</h1>

                    <p className="text-gray-900 text-base">The opponent player exited the game</p>

                    <ButtonGroup/>
                </div>
            </motion.div>

        </motion.section>
    );
};