"use client";
import withAuth from "@/_hocs/withAuth";
import ClipBoard from "@/_components/icons/ClipBoard";
import Link from "next/link";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import useAuth from "@/_providers/auth/useAuth";

import { useState } from "react";
import { Room } from "@/_types";

function Home() {
    const { user } = useAuth();
    const [ roomID, setRoomID ] = useState<string | null>(null);
    const [ url, setURL ] = useState<string | null>(null);
    const [ isCreated, setIsCreated ] = useState(true);
    const handleCreateGame = async () => {
        if (!isCreated) return;

        setIsCreated(false);
        const collectionRef = collection(getFirestore(), "rooms");
        const gameData: Room = {
            isGameStarted: false,
            isGameCompleted: false,
            winnerGamer: null,
            gameOwner: user?.uid as string,
            moveOrder: user?.uid as string,
            gamer1: {
                id: user?.uid || null,
                treasure: 0,
                pits: [ 4, 4, 4, 4, 4, 4 ],
            },
            gamer2: {
                id: null,
                treasure: 0,
                pits: [ 4, 4, 4, 4, 4, 4 ],
            }
        }
        const docRef = await addDoc(collectionRef, gameData)
        setIsCreated(true);
        setRoomID(docRef.id);
        setURL(`${process.env.NEXT_PUBLIC_SITE_URL}/room/${docRef.id}`);
    }
    return (
        <article className="grid place-items-center px-4 lg:px-0 py-8 lg:py-16">
            <div
                className="w-full max-w-2xl mx-auto grid items-center justify-center gap-10 p-8 shadow-xl bg-white rounded-lg">
                <h1 className="text-purple-500 text-xl lg:text-2xl text-center">Create your room and join the room</h1>
                <button
                    onClick={handleCreateGame}
                    className="w-full max-w-[15rem] mx-auto text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700  focus:outline-none font-medium rounded-lg px-5 py-2.5">Create
                    Game
                </button>


                {url && (
                    <>
                        <hr/>
                        <div className="flex items-center text-xs lg:text-sm gap-3 truncate">
                            <span className="font-semibold">Room Url :</span>
                            <Link href={`/room/${roomID}`}
                                  className="text-blue-500 truncate w-2/3">{url}</Link>
                            <ClipBoard className="w-4 h-4 lg:w-6 lg:h-6 text-purple-500 cursor-pointer"/>
                        </div>
                    </>
                )}
            </div>
        </article>
    )
}

export default withAuth(Home);