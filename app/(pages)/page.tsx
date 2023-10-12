"use client";
import { useRef, useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
import withAuth from "@/_hocs/withAuth";
import useAuth from "@/_providers/auth/useAuth";
import generatePits from "@/_utilities/generatePits";
import useLoader from "@/_store/useLoader";
import { RoomRaw } from "@/_types";
import PageContainer from "@/_components/PageContainer";
import ClipBoardURL from "@/_components/ClipBoardURL";


function Home() {
    const loader = useLoader();
    const { user } = useAuth();
    const [ roomID, setRoomID ] = useState<string | null>(null);

    const currentStoneIndex = useRef(1);

    /**
     * Asynchronously creates a new game room in Firestore.
     *
     * This function does the following:
     * - Opens a loading screen using the `loader` from `useLoader`.
     * - Prepares the initial game data with pits generated using `generatePits`.
     * - Adds the game data to the 'rooms' collection in Firestore.
     * - On success, updates the local state with the new room ID.
     * - Closes the loading screen.
     * - If an error occurs during the process, a toast error message is displayed.
     */
    const handleCreateGame = async () => {
       try {
           loader.onOpen();
           const collectionRef = collection(getFirestore(), "rooms");
           const gameData: RoomRaw = {
               isGameStarted: false,
               isGameCompleted: false,
               winnerGamer: null,
               gameOwner: user?.uid as string,
               moveOrder: user?.uid as string,
               moveStartTimestamp: null,
               gamer1: {
                   id: user?.uid || null,
                   treasure: [],
                   pits: generatePits(currentStoneIndex),
               },
               gamer2: {
                   id: null,
                   treasure: [],
                   pits: generatePits(currentStoneIndex),
               }
           }
           const docRef = await addDoc(collectionRef, gameData)
           setRoomID(docRef.id);
       }catch (e) {
           toast.error("Oops! Something went wrong while starting your game. Please try again!")
       }finally {
           loader.onClose();
       }
    }


    return (
        <PageContainer>
            <article className="grid place-items-center px-4 lg:px-0 py-8 lg:py-16">
                <div
                    className="w-full max-w-2xl mx-auto grid items-center justify-center gap-10 p-8 shadow-xl bg-white rounded-lg">
                    <h1 className="text-purple-500 text-xl lg:text-2xl text-center">Create your room and join the
                        room</h1>
                    <button
                        onClick={handleCreateGame}
                        className="w-full max-w-[15rem] mx-auto text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700  focus:outline-none font-medium rounded-lg px-5 py-2.5">Create
                        Game
                    </button>


                    {roomID && (
                        <ClipBoardURL roomID={roomID}/>
                    )}

                </div>
            </article>
        </PageContainer>
    )
}

export default withAuth(Home);