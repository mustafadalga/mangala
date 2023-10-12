import { useParams, useRouter } from "next/navigation";
import { doc, DocumentReference, getFirestore, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import useLoader from "@/_store/useLoader";
import useAuth from "@/_providers/auth/useAuth";

export default function RoomOptions() {
    const { push } = useRouter();
    const { id }: { id: string } = useParams();
    const { user } = useAuth();
    const db = getFirestore();
    const loader = useLoader();
    const docRef: DocumentReference = doc(db, "rooms", id);


    const handleExit = async () => {
       try {
           loader.onOpen();
           await updateDoc(docRef, {
               exitGame:{
                   userId: user?.uid as string,
               }
           })
           loader.onClose();
           push("/");
       }catch (e){
           toast.error("Oops! Something went wrong while exiting game. Please try again!")
       }
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