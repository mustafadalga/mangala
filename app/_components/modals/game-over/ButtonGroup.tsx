import { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import useModalGameOver from "@/_store/useModalGameOver";
import { doc, DocumentReference, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
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

    /**
     * Asynchronously creates a new game in Firestore by updating the game's document with initial data.
     *
     * This function does the following:
     * - Updates the document with game data to mark the game as started.
     * - Resets the treasure and pits for both gamers using `generatePits`.
     * - Closes any open modal or pop-up using `onClose`.
     * - If an error occurs during the process, a toast error message is displayed.
     */
    const handleNewGame = async () => {
      try {
          await updateDoc(docRef, {
              isGameStarted: true,
              isGameCompleted: false,
              winnerGamer: null,
              moveOrder: user?.uid as string,
              moveStartTimestamp: serverTimestamp(),
              "gamer1.treasure": [],
              "gamer1.pits": generatePits(currentStoneIndex),
              "gamer2.treasure": [],
              "gamer2.pits": generatePits(currentStoneIndex),
          })
          onClose();
      }catch (e) {
          toast.error("Oops! Something went wrong while creating new game. Please refresh the page and try again!")
      }
    }

    /**
     * Asynchronously updates the game's state in Firestore to indicate the user's intent to exit the game.
     *
     * This function does the following:
     * - Updates the document with the `exitGame` field to store the ID of the user intending to exit.
     * - Closes any open modal or pop-up using `onClose`.
     * - Redirects the user to the home page.
     * - If an error occurs during the process, a toast error message is displayed.
     */
    const handleExit = async () => {
      try {
          await updateDoc(docRef, {
              exitGame:{
                  userId: user?.uid as string,
              }
          })
          onClose();
          push("/");
      }catch (e) {
          toast.error("Oops! Something went wrong while exiting game. Please try again!")
      }
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