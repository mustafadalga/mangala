import { useParams, useRouter } from "next/navigation";
import useModalGameOver from "@/_store/useModalGameOver";
import { doc, DocumentReference, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import generatePits from "@/_utilities/generatePits";
import useAuth from "@/_providers/auth/useAuth";

export default function ButtonGroup() {
    const { push } = useRouter();
    const { id }: { id: string } = useParams();
    const { onClose } = useModalGameOver();

    const db = getFirestore();
    const { user } = useAuth();
    const currentStoneIndex = useRef(1);
    const docRef: DocumentReference = doc(db, "rooms", id);

    const handleNewGame = async () => {
        await updateDoc(docRef, {
            isGameStarted: true,
            isGameCompleted: false,
            winnerGamer: null,
            gameOwner: user?.uid as string,
            moveOrder: user?.uid as string,
            moveStartTimestamp: serverTimestamp(),
            "gamer1.treasure": [],
            "gamer1.pits": generatePits(currentStoneIndex),
            "gamer2.treasure": [],
            "gamer2.pits": generatePits(currentStoneIndex),
        })
        onClose();
    }
    const handleExit = () => {
        onClose();
        push("/");
    }

    return (
        <div className="mt-10 flex justify-center gap-3">
            <button
                onClick={handleNewGame}
                className="w-24 xs:w-32 sm:w-40 text-[10px] xs:text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700  focus:outline-none border border-white font-medium rounded-lg px-5 py-1 sm:py-1.5">
                New Game
            </button>
            <button
                onClick={handleExit}
                className="w-24 xs:w-32 sm:w-40 text-[10px] xs:text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700  focus:outline-none border border-white font-medium rounded-lg px-5 py-1 sm:py-1.5">
                Exit
            </button>
        </div>
    );
};