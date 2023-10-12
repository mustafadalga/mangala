import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { doc, DocumentReference, getFirestore, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Countdown from "@/_components/Countdown";
import { Room } from "@/_types";
import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";

interface Props {
    room: Room,
    startTime: Timestamp,
    pause: boolean,
    className?: string,
}

export default function CountdownProgressBar({ room, startTime, pause, className }: Props) {
    const { id: roomID }: { id: string } = useParams();
    const db = getFirestore()
    const docRef: DocumentReference = doc(db, "rooms", roomID);

    const memorizedStartTime = useDeepCompareMemoize(startTime);
    const elapsedSeconds = useMemo(() => {
        if (!memorizedStartTime) return 0;

        const now = Timestamp.now();
        return Math.floor(now.toMillis() - memorizedStartTime.toMillis()) / 1000;
    }, [ memorizedStartTime ]);

    const onComplete = useCallback(() => {
       try {
           updateDoc(docRef, {
               "moveOrder": room.moveOrder == room.gamer1.id ? room.gamer2.id : room.gamer1.id,
               moveStartTimestamp: serverTimestamp(),
           });
       }catch (e) {
           toast.error("Oops! Something went wrong while updating move order. Please try again!")
       }
    }, [ docRef, room.moveOrder, room.gamer1.id, room.gamer2.id ])

    return <Countdown
        initialSeconds={elapsedSeconds}
        endSeconds={60}
        className={className}
        pause={pause}
        onComplete={onComplete}/>
}

