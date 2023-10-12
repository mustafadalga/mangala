import { useParams, useRouter } from "next/navigation";
import { deleteDoc, doc, DocumentReference, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

export default function ButtonGroup() {
    const { push } = useRouter();
    const { id }: { id: string } = useParams();
    const db = getFirestore();
    const docRef: DocumentReference = doc(db, "rooms", id);

    const handleExit = async () => {
        try {
            await deleteDoc(docRef);
            push("/");
        }catch (e){
            toast.error("Oops! Something went wrong while exiting game. Please try again!")
        }
    }
    return (
        <div className="mt-10 flex justify-center gap-3">
            <button
                onClick={handleExit}
                className="w-24 xs:w-32 sm:w-40 text-[10px] xs:text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700  focus:outline-none border border-white font-medium rounded-lg px-5 py-1 sm:py-1.5">
                Exit
            </button>
        </div>
    );
};