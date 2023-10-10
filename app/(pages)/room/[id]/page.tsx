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
    serverTimestamp
} from "firebase/firestore"
import { Timestamp } from "firebase/firestore";
import useLoader from "@/_store/useLoader";
import withAuth from "@/_hocs/withAuth";
import useAuth from "@/_providers/auth/useAuth";
import convertObjectToArray from "@/_utilities/convertObjectToArray";
import { Direction } from "@/_enums";
import { Room, RoomRaw } from "@/_types";
import Treasure from "@/_components/game/Treasure";
import Pits from "@/_components/game/Pits";
import PageContainer from "@/_components/PageContainer";
import RoomOptions from "@/_components/game/RoomOptions";
import CountdownProgressBar from "@/_components/game/CountdownProgressBar";


const Page = ({ params: { id } }: {
    params: {
        id: string
    }
}) => {
    const loader = useLoader();
    const { user, isLoaded: isUserLoaded } = useAuth();
    const { push } = useRouter();
    const db = getFirestore()
    const [ room, setRoom ] = useState<Room | null>(null);
    const areBothGamersJoined = useMemo(() => !!(room?.gamer1.id && room.gamer2.id), [ room?.gamer1.id, room?.gamer2.id ])
    const isFirstGamer = useMemo(() => user?.uid == room?.gamer1.id, [ room?.gamer1.id, user?.uid ]);
    const showCountDown = room?.isGameStarted && !room?.isGameCompleted;
    const docRef: DocumentReference = doc(db, "rooms", id);

    const countDownState = useMemo(() => ({
        left: room?.gamer1.id === room?.moveOrder,
        right: room?.gamer2.id === room?.moveOrder
    }), [ room?.gamer1.id, room?.gamer2.id, room?.moveOrder ]);

    const setSecondGamer = useCallback(async () => {
        await updateDoc(docRef, {
            "gamer2.id": user?.uid,
        })
    }, [ user?.uid, docRef ]);
    const startGame = useCallback(async () => {
        await updateDoc(docRef, {
            isGameStarted: true,
            moveStartTimestamp: serverTimestamp(),
        })
    }, [ docRef ]);

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

    useEffect(() => {
        const unSubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
            if (doc.exists() && !doc.data().isGameCompleted) {
                setRoomData(doc.data() as RoomRaw)
            } else {
                push("/")
            }
        });
        return () => {
            unSubscribe();
        };

    }, []);

    useEffect(() => {
        if (!isUserLoaded || areBothGamersJoined || isFirstGamer || !room) return;

        setSecondGamer();
        startGame();

    }, [ isUserLoaded, areBothGamersJoined, isFirstGamer, setSecondGamer, startGame ]);


    useEffect(() => {
        isUserLoaded ? loader.onClose() : loader.onOpen();
    }, [ isUserLoaded ]);

    if (!room) return null;

    return (
        <PageContainer>
            <main className="h-screen flex flex-col bg-no-repeat bg-cover bg-[url('/bg-room.jpeg')]">
                <div className="mt-20">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-5 p-5">
                        {room?.gamer1 && (
                            <div className="flex flex-col w-full items-center gap-3">
                                {showCountDown &&
                                    <CountdownProgressBar
                                        room={room}
                                        pause={!countDownState.left}
                                        className={countDownState.left ? "bg-green-600/50 border-green-500":"backdrop-blur-sm bg-purple-900/10 border-white"}
                                        startTime={room.moveStartTimestamp as Timestamp}/>}
                                <Treasure treasure={room?.gamer1.treasure}/>
                            </div>
                        )}

                        <div className="grid grid-cols-6 place-items-center gap-3 my-10 lg:my-0">
                            {room?.gamer1.pits && <Pits
                                gamer={room.gamer1}
                                rivalGamer={room.gamer2}
                                gameOwner={room.gameOwner}
                                moveOrder={room.moveOrder}
                                isCurrentGamerPits={user?.uid == room.gamer1.id}
                                isGameStarted={room.isGameStarted}
                                isGameCompleted={room.isGameCompleted}
                                position={Direction.Top}
                            />}


                            {room?.gamer2.pits && <Pits
                                gamer={room.gamer2}
                                rivalGamer={room.gamer1}
                                gameOwner={room.gameOwner}
                                moveOrder={room.moveOrder}
                                isCurrentGamerPits={user?.uid == room.gamer2.id}
                                isGameStarted={room.isGameStarted}
                                isGameCompleted={room.isGameCompleted}
                                position={Direction.Bottom}/>}
                        </div>

                        {room?.gamer2 && (
                            <div className="flex flex-col w-full items-center gap-3">
                                {showCountDown && <CountdownProgressBar room={room}
                                                                        startTime={room.moveStartTimestamp as Timestamp}
                                                                        pause={!countDownState.right}
                                                                        className={`${countDownState.right ? "bg-green-600/50 border-green-500":"backdrop-blur-sm bg-purple-900/10 border-white"} order-2 lg:order-1`}/>
                                }
                                <Treasure treasure={room?.gamer2.treasure}
                                          className="order-1 lg:order-2"/>
                            </div>
                        )}
                    </div>

                    {room && <RoomOptions id={id}/>}
                </div>
            </main>
        </PageContainer>);
};

export default withAuth(Page)