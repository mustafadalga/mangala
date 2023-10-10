import { useRouter } from "next/navigation";
import { doc, DocumentReference, getFirestore, updateDoc } from "firebase/firestore";
import useLoader from "@/_store/useLoader";

export default function RoomOptions({ id }: { id: string }) {
    const { push } = useRouter();
    const db = getFirestore();
    const loader = useLoader();
    const docRef: DocumentReference = doc(db, "rooms", id);


    const handleExit = async () => {
        loader.onOpen();
        await updateDoc(docRef, {
            "isGameCompleted": true,
        })
        loader.onClose();
        push("/");
    }
    return (
        <div className="m-20 flex justify-center gap-3">
            <button
                onClick={handleExit}
                className="w-24 xs:w-32 sm:w-40 text-[10px] xs:text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700  focus:outline-none border border-white font-medium rounded-lg px-5 py-2 sm:py-2.5">
                Exit
            </button>
        </div>
    );
};