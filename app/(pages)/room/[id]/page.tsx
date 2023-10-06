"use client";
import { doc, DocumentReference, DocumentSnapshot, updateDoc, getFirestore, onSnapshot } from "firebase/firestore"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Room } from "@/_types";
import { useRouter } from "next/navigation";
import withAuth from "@/_hocs/withAuth";
import useAuth from "@/_providers/auth/useAuth";
import Treasure from "@/_components/game/Treasure";
import Pits from "@/_components/game/Pits";
import { Direction } from "@/_enums";

const Page = ({ params: { id } }: { params: { id: string } }) => {
    const { user, isLoaded: isUserLoaded } = useAuth();
    const { push } = useRouter();
    const db = getFirestore()
    const [ room, setRoom ] = useState<Room | null>(null);
    const [ isGameLoaded, setIsGameLoaded ] = useState(false);
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

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const unSubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
            timeoutId = setTimeout(() => setIsGameLoaded(true), 300);

            if (doc.exists()) {
                setRoom(doc.data() as Room);
            } else {
                push("/");
            }
        });

        return () => {
            clearTimeout(timeoutId);
            unSubscribe();
        };

    }, []);

    useEffect(() => {
        if (!isUserLoaded || !isGameLoaded || areBothGamersJoined || isFirstGamer) return;

        setSecondGamer();
        startGame();

    }, [ isUserLoaded, isGameLoaded, areBothGamersJoined, isFirstGamer, setSecondGamer, startGame ])

    if (!isGameLoaded) return null;

    return (
        <main className="h-screen flex flex-col bg-no-repeat bg-cover bg-[url('/bg-room.jpg')]">
            <div className="mt-20">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-5 p-5 lg:p-20">
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
                        />
                        }
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
    );
};

export default withAuth(Page)