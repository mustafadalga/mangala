"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, DocumentReference, DocumentSnapshot, updateDoc, getFirestore, onSnapshot } from "firebase/firestore"
import withAuth from "@/_hocs/withAuth";
import useAuth from "@/_providers/auth/useAuth";
import convertObjectToArray from "@/_utilities/convertObjectToArray";
import { Direction } from "@/_enums";
import { Room, RoomRaw } from "@/_types";
import Treasure from "@/_components/game/Treasure";
import Pits from "@/_components/game/Pits";
import PageContainer from "@/_components/PageContainer";
import useLoader from "@/_store/useLoader";


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
    const isFirstGamer = useMemo(() => user?.uid == room?.gamer1.id, [ room?.gamer1.id, user?.uid ])
    const docRef: DocumentReference = doc(db, "rooms", id);

    const setSecondGamer = useCallback(async () => {
        await updateDoc(docRef, {
            "gamer2.id": user?.uid,
        })
    }, [ user?.uid, docRef ]);
    const startGame = useCallback(async () => {
        await updateDoc(docRef, {
            isGameStarted: true
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
            doc.exists() ? setRoomData(doc.data() as RoomRaw) : push("/")
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
    }, [ isUserLoaded ])

    return (
        <PageContainer>
            <main className="h-screen flex flex-col bg-no-repeat bg-cover bg-[url('/bg-room.jpeg')]">
                <div className="mt-20">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-5 p-5">
                        {room?.gamer1 && <Treasure treasure={room?.gamer1.treasure}/>}

                        <div className="grid grid-cols-6 place-items-center gap-3">
                            {room?.gamer1.pits && <Pits roomID={id}
                                                        gamer={room.gamer1}
                                                        rivalGamer={room.gamer2}
                                                        gameOwner={room.gameOwner}
                                                        moveOrder={room.moveOrder}
                                                        isCurrentGamerPits={user?.uid == room.gamer1.id}
                                                        isGameStarted={room.isGameStarted}
                                                        isGameCompleted={room.isGameCompleted}
                                                        position={Direction.Top}
                            />}


                            {room?.gamer2.pits && <Pits roomID={id}
                                                        gamer={room.gamer2}
                                                        rivalGamer={room.gamer1}
                                                        gameOwner={room.gameOwner}
                                                        moveOrder={room.moveOrder}
                                                        isCurrentGamerPits={user?.uid == room.gamer2.id}
                                                        isGameStarted={room.isGameStarted}
                                                        isGameCompleted={room.isGameCompleted}
                                                        position={Direction.Bottom}/>}
                        </div>

                        {room?.gamer2 && <Treasure treasure={room?.gamer2.treasure}/>}
                    </div>
                </div>
            </main>
        </PageContainer>);
};

export default withAuth(Page)