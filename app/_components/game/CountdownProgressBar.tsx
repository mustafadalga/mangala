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

/**
 * CountdownProgressBar component that manages and displays a countdown timer specific for a game room.
 *
 * @param room - The current game room.
 * @param startTime - The timestamp when the countdown started.
 * @param pause - If `true`, the countdown will be paused.
 * @param className - Optional CSS class to style the component.
 * @returns The rendered CountdownProgressBar component.
 */
export default function CountdownProgressBar({ room, startTime, pause, className }: Props) {
    const { id: roomID }: { id: string } = useParams();
    const db = getFirestore()
    const docRef: DocumentReference = doc(db, "rooms", roomID);

    /**
     * Memoizes the `startTime` for performance optimization.
     */
    const memorizedStartTime = useDeepCompareMemoize(startTime);

    /**
     * Computes the elapsed seconds since the `startTime`.
     *
     * @returns The number of seconds elapsed since the `startTime`.
     */
    const elapsedSeconds = useMemo(() => {
        if (!memorizedStartTime) return 0;

        const now = Timestamp.now();
        return Math.floor(now.toMillis() - memorizedStartTime.toMillis()) / 1000;
    }, [ memorizedStartTime ]);

    /**
     * Handles the logic when the countdown timer completes.
     * Updates the move order in the Firestore database.
     */
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

