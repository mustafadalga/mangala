"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    doc,
    DocumentReference,
    DocumentSnapshot,
    updateDoc,
    getFirestore,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "firebase/firestore"
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useLoader from "@/_store/useLoader";
import withAuth from "@/_hocs/withAuth";
import useAuth from "@/_providers/auth/useAuth";
import useModalGameOver from "@/_store/useModalGameOver";
import convertObjectToArray from "@/_utilities/convertObjectToArray";
import { Direction } from "@/_enums";
import { Room, RoomRaw } from "@/_types";
import Treasure from "@/_components/game/Treasure";
import Pits from "@/_components/game/Pits";
import PageContainer from "@/_components/PageContainer";
import RoomOptions from "@/_components/game/RoomOptions";
import CountdownProgressBar from "@/_components/game/CountdownProgressBar";
import ModalGameOver from "@/_components/modals/game-over/ModalGameOver";
import ModalExitGame from "@/_components/modals/exit-game/ModalExitGame";

/**
 * The main game page that displays all game components and manages game logic.
 *
 * This page shows the game room where two players can play against each other.
 * It handles game start and end states, shows countdowns for each player's moves,
 * and updates Firestore in real-time with game data.
 *
 * @param params.id - The ID of the game room.
 * @returns The rendered game page.
 */
const Page = ({ params: { id } }: {
    params: {
        id: string
    }
}) => {
    const loader = useLoader();
    const {
        isOpen: isModalGameOverOpen,
        onOpen: onOpenModalGameOver,
        onClose: onCloseModalGameOver
    } = useModalGameOver();
    const { user, isLoaded: isUserLoaded } = useAuth();
    const { push } = useRouter();
    const db = getFirestore()
    const [ room, setRoom ] = useState<Room | null>(null);
    const areBothGamersJoined = useMemo(() => !!(room?.gamer1.id && room.gamer2.id), [ room?.gamer1.id, room?.gamer2.id ])
    const isFirstGamer = useMemo(() => user?.uid == room?.gamer1.id, [ room?.gamer1.id, user?.uid ]);
    const showCountDown = room?.isGameStarted && !room?.isGameCompleted;
    const docRef: DocumentReference = doc(db, "rooms", id);

    /**
     * Computes whether the Exit Game modal should be shown.
     *
     * The modal will be shown if another user has initiated an exit and the current user has not
     * confirmed it yet. It's important that both gamers have joined the room and the user data is loaded.
     *
     * @returns {boolean} - `true` if the modal should be shown, `false` otherwise.
     */
    const showModalExitGame = useMemo(() => {
        if (!isUserLoaded || !areBothGamersJoined) return false;

        return room?.exitGame?.userId && room.exitGame.userId !== user?.uid
    }, [ isUserLoaded, areBothGamersJoined, room?.exitGame?.userId, user?.uid ]);

    /**
     * Computes the state of the countdown for both gamers.
     *
     * - `left`: Indicates whether the left gamer (gamer1) should have the countdown running.
     * - `right`: Indicates whether the right gamer (gamer2) should have the countdown running.
     *
     * @returns {Object} - An object with the countdown state for both gamers.
     */
    const countDownState = useMemo(() => ({
        left: room?.gamer1.id === room?.moveOrder,
        right: room?.gamer2.id === room?.moveOrder
    }), [ room?.gamer1.id, room?.gamer2.id, room?.moveOrder ]);

    /**
     * Determines if the current user is authorized to play in the room.
     */
    const hasAuthorization = useMemo(() => areBothGamersJoined && (user?.uid === room?.gamer1.id || user?.uid === room?.gamer2.id),
        [ areBothGamersJoined, user?.uid, room?.gamer1.id, room?.gamer2.id ]);

    /**
     * Sets the second gamer in the game room.
     */
    const setSecondGamer = useCallback(async () => {
        try {
            await updateDoc(docRef, {
                "gamer2.id": user?.uid,
            })
        } catch (e) {
            toast.error("Oops! Something went wrong while starting game. Please refresh the page and try again!")
        }
    }, [ user?.uid, docRef ]);

    /**
     * Starts the game by updating the game state in Firestore.
     */
    const startGame = useCallback(async () => {
        try {
            await updateDoc(docRef, {
                isGameStarted: true,
                moveStartTimestamp: serverTimestamp(),
            })
        } catch (e) {
            toast.error("Oops! Something went wrong while starting game. Please refresh the page and try again!")
        }
    }, [ docRef ]);

    /**
     * Converts the raw room data from Firestore to the desired format and updates the local state.
     *
     * @param roomRaw - The raw room data from Firestore.
     */
    const setRoomData = useCallback((roomRaw: RoomRaw) => {
        const room = {
            ...roomRaw,
            gamer1: {
                ...roomRaw.gamer1,
                pits: convertObjectToArray(roomRaw.gamer1.pits)
            },
            gamer2: {
                ...roomRaw.gamer2,
                pits: convertObjectToArray(roomRaw.gamer2.pits)
            },
        }
        setRoom(room);
    }, []);


    /**
     * Effect hook to fetch the room data in real-time from Firestore.
     * Unsubscribes from Firestore updates on unmount.
     */
    useEffect(() => {
        let unSubscribe: (() => void) | undefined;

        try {
            unSubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
                if (doc.exists()) {
                    setRoomData(doc.data() as RoomRaw)
                } else {
                    push("/")
                }
            });
        } catch (_) {
            toast.error("Oops! Something went wrong while loading game. Please refresh the page and try again!")
        }

        return () => {
            if (unSubscribe) {
                unSubscribe();
            }
        };
    }, []);

    /**
     * Effect hook to initiate the game if conditions are met.
     * Sets the second gamer and starts the game.
     */
    useEffect(() => {
        if (!isUserLoaded || areBothGamersJoined || isFirstGamer || !room) return;

        setSecondGamer();
        startGame();

    }, [ isUserLoaded, areBothGamersJoined, isFirstGamer, setSecondGamer, startGame ]);


    /**
     * Effect hook to manage the loading state based on user load state.
     */
    useEffect(() => {
        isUserLoaded ? loader.onClose() : loader.onOpen();
    }, [ isUserLoaded ]);

    /**
     * Effect hook to manage the game over modal based on game completion state.
     */
    useEffect(() => {
        if (!isUserLoaded || !room) return;

        room.isGameCompleted ? onOpenModalGameOver() : onCloseModalGameOver();

    }, [ isUserLoaded, room, onOpenModalGameOver, onCloseModalGameOver ]);

    /**
     * Effect hook to check user authorization for the game room.
     * Redirects unauthorized users to the home page.
     */
    useEffect(() => {
        if (!isUserLoaded || !areBothGamersJoined || !room?.gamer1 || !room?.gamer2) return;

        if (!hasAuthorization) {
            push("/");
        }

    }, [ isUserLoaded, room?.gamer1, room?.gamer2, hasAuthorization, areBothGamersJoined, push ]);

    if (!room) return null;

    return (
        <PageContainer>
            <main
                className="h-full flex flex-col bg-no-repeat bg-cover bg-fixed bg-[url('/bg-room.jpeg')]">
                <div className="lg:mt-20">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-5 p-5">
                        <div className="flex flex-col  w-full lg:w-auto  items-center gap-3">
                            {showCountDown &&
                                <CountdownProgressBar
                                    room={room}
                                    pause={!countDownState.left}
                                    className={countDownState.left ? "bg-green-950/50 border-green-500" : "bg-black/60 border-white"}
                                    startTime={room.moveStartTimestamp as Timestamp}/>}
                            <Treasure treasure={room?.gamer1.treasure}/>
                        </div>

                        <div className="grid grid-cols-6 place-items-center gap-3 my-10 lg:mb-0 lg:mt-[5.626rem]">
                            <Pits
                                gamer={room.gamer1}
                                rivalGamer={room.gamer2}
                                gameOwner={room.gameOwner}
                                moveOrder={room.moveOrder}
                                isCurrentGamerPits={user?.uid == room.gamer1.id}
                                isGameStarted={room.isGameStarted}
                                isGameCompleted={room.isGameCompleted}
                                position={Direction.Top}
                            />


                            <Pits
                                gamer={room.gamer2}
                                rivalGamer={room.gamer1}
                                gameOwner={room.gameOwner}
                                moveOrder={room.moveOrder}
                                isCurrentGamerPits={user?.uid == room.gamer2.id}
                                isGameStarted={room.isGameStarted}
                                isGameCompleted={room.isGameCompleted}
                                position={Direction.Bottom}/>
                        </div>

                        <div className="flex flex-col  w-full lg:w-auto  items-center gap-3">
                            {showCountDown && <CountdownProgressBar room={room}
                                                                    startTime={room.moveStartTimestamp as Timestamp}
                                                                    pause={!countDownState.right}
                                                                    className={`${countDownState.right ? "bg-green-950/50 border-green-500" : "bg-black/60 border-white"} order-2 lg:order-1`}/>
                            }
                            <Treasure treasure={room?.gamer2.treasure}
                                      className="order-1 lg:order-2"/>
                        </div>
                    </div>

                    {room && <RoomOptions/>}
                </div>
            </main>
            <AnimatePresence>
                {isModalGameOverOpen && <ModalGameOver/>}
                {showModalExitGame && <ModalExitGame/>}
            </AnimatePresence>
        </PageContainer>);
};

export default withAuth(Page)