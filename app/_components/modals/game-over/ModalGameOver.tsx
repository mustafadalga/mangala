import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, DocumentReference, getDoc, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import IconXMark from "@/_components/icons/IconXMark";
import useModalGameOver from "@/_store/useModalGameOver";
import { RoomRaw, User } from "@/_types";
import GamersState from "./GamersState";
import ButtonGroup from "./ButtonGroup";
import { backdropVariants, modalVariants } from "@/_constants";

export interface GamerState {
    displayName: string,
    totalTreasure: number
}


export default function ModalGameOver() {
    const { id: roomID }: { id: string } = useParams();
    const { onClose } = useModalGameOver();
    const db = getFirestore()
    const roomDocRef: DocumentReference = doc(db, "rooms", roomID);
    const [ room, setRoom ] = useState<RoomRaw | null>()
    const [ gamers, setGamers ] = useState<User[]>([]);
    const gamersState = useMemo<GamerState[]>(() => {
        if (gamers.length === 0) return [];

        const state: GamerState[] = [];

        const gamer1 = {
            displayName: gamers.find(user => user.uid === room?.gamer1.id)?.displayName || "",
            totalTreasure: room?.gamer1.treasure.length || 0,
        }
        const gamer2 = {
            displayName: gamers.find(user => user.uid === room?.gamer2.id)?.displayName || "",
            totalTreasure: room?.gamer2.treasure.length || 0,
        }

        if (gamer1.totalTreasure >= gamer2.totalTreasure) {
            state.push(gamer1)
            state.push(gamer2)
        } else {
            state.push(gamer2)
            state.push(gamer1)
        }

        return state;
    }, [ gamers, room?.gamer1.id, room?.gamer2.id, room?.gamer1.treasure, room?.gamer2.treasure ]);

    const winnerDisplayName = useMemo(() => {
        if (gamersState.length === 0) return "";

        if (gamersState[0].totalTreasure > gamersState[1].totalTreasure) {
            return `${gamersState[0].displayName} Wins`;
        } else if (gamersState[0].totalTreasure < gamersState[1].totalTreasure) {
            return `${gamersState[1].displayName} Wins`;
        }

        return "The game ended in a draw!";
    }, [ gamersState ])

    /**
     * Asynchronously fetches the game room data from Firestore.
     *
     * This function does the following:
     * - Fetches the document of the current game room using its ID.
     * - Updates the `room` state with the fetched data.
     * - If an error occurs during the fetch, a toast error message is displayed.
     */
    const handleGetRoom = useCallback(async () => {
       try {
           const docSnap = await getDoc(roomDocRef)
           if (docSnap.exists()) {
               setRoom(docSnap.data() as RoomRaw)
           }
       }catch (e) {
           toast.error("Oops! Something went wrong while loading room data. Please refresh the page and try again!")

       }
    }, [ roomDocRef ]);

    /**
     * Asynchronously fetches the users' data associated with the current game room from Firestore.
     *
     * This function does the following:
     * - Fetches the documents of both the gamers using their IDs.
     * - Updates the `gamers` state with the fetched users' data.
     * - If an error occurs during the fetch, a toast error message is displayed.
     */
    const handleGetUsers = useCallback(async () => {
       try {
           const gamer1DocRef = doc(db, "users", room?.gamer1.id as string);
           const gamer2DocRef = doc(db, "users", room?.gamer2.id as string);

           const gamer1DocSnap = await getDoc(gamer1DocRef);
           const gamer2DocSnap = await getDoc(gamer2DocRef);

           const users = [];

           if (gamer1DocSnap.exists()) {
               users.push(gamer1DocSnap.data() as User);
           }

           if (gamer2DocSnap.exists()) {
               users.push(gamer2DocSnap.data() as User);
           }

           setGamers(users)
       }catch (e) {
           toast.error("Oops! Something went wrong while loading users. Please refresh the page and try again!")
       }

    }, [ room?.gamer1.id, room?.gamer2.id, db ]);

    useEffect(() => {
        handleGetRoom();
    }, []);

    useEffect(() => {
        if (room?.gamer1.id && room?.gamer2) {
            handleGetUsers();
        }
    }, [ room?.gamer1.id, room?.gamer2, handleGetUsers ]);

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
                        <button type="button"
                                onClick={onClose}
                                className="text-gray-400 absolute top-2.5 right-2.5 hover:text-gray-900 text-sm">
                            <IconXMark className="h-5 w-5"/>
                        </button>

                        <h1 className="mt-5 font-semibold text-2xl lg:text-3xl xl:text-4xl text-purple-600">Game Over</h1>


                        <GamersState winnerDisplayName={winnerDisplayName}
                                     gamersState={gamersState}/>

                        <ButtonGroup/>
                    </div>
                </motion.div>

            </motion.section>
    );
};