import { useCallback } from "react";
import { doc, DocumentReference, getFirestore, updateDoc } from "firebase/firestore";
import useAuth from "@/_providers/auth/useAuth";
import { Gamer } from "@/_types";
import { Direction } from "@/_enums";
import Pit from "@/_components/game/Pit";

interface Props {
    roomID: string,
    gamer: Gamer;
    rivalGamer: Gamer,
    gameOwner: string,
    moveOrder: string,
    isCurrentGamerPits: boolean,
    isGameStarted: boolean,
    isGameCompleted: boolean,
    position: Direction
}

const SINGLE_STONE_THRESHOLD = 1;
const LAST_STONE_THRESHOLD = 0;
const TOP_BOUNDARY = -1;
const BOTTOM_BOUNDARY = 6;
export default function Pits({ roomID, gamer, rivalGamer, gameOwner, moveOrder, isCurrentGamerPits, position, isGameStarted, isGameCompleted }: Props) {
    const { user } = useAuth();
    const db = getFirestore()
    const docRef: DocumentReference = doc(db, "rooms", roomID);
    const isUserAllowedToMove = (user?.uid == moveOrder) && isGameStarted && !isGameCompleted;
    const hasRight = isCurrentGamerPits && isUserAllowedToMove;
    const isGameOwner = user?.uid == gameOwner;

    const determineWinner = useCallback((currentGamer: Gamer, rival: Gamer, isAllPitsEmpty: boolean): string | null => {
        if (!isAllPitsEmpty) return null;

        if (currentGamer.treasure > rival.treasure) return currentGamer.id;
        else if (currentGamer.treasure < rival.treasure) return rival.id;
        else return null;

    }, []);
    const handleIsLastStoneMakesRivalPitEven = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, isLastStone: boolean, isDirectionTop: boolean) => {
        const isLastStoneMakesRivalPitEven = isLastStone && ((isDirectionTop && !isGameOwner) || (!isDirectionTop && isGameOwner)) && rival.pits[currentIndex] % 2 === 0;
        if (isLastStoneMakesRivalPitEven) {
            gamer.treasure += rival.pits[currentIndex];
            rival.pits[currentIndex] = 0;
        }
    }, [ isGameOwner ]);

    const handleIsLastPitOneStone = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, isLastStone: boolean) => {
        const isLastPitOneStone = gamer.pits[currentIndex] === SINGLE_STONE_THRESHOLD;
        const hasRivalPitOneStone = rival.pits[currentIndex] > LAST_STONE_THRESHOLD;
        if (isLastPitOneStone && isLastStone && hasRivalPitOneStone) {
            gamer.treasure += gamer.pits[currentIndex] + rival.pits[currentIndex];
            gamer.pits[currentIndex] = 0;
            rival.pits[currentIndex] = 0;
        }
    }, []);
    const handleUpdateCurrentPit = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, isDirectionTop: boolean) => {
        if (isGameOwner) {
            isDirectionTop ? gamer.pits[currentIndex]++ : rival.pits[currentIndex]++;
        } else {
            isDirectionTop ? rival.pits[currentIndex]++ : gamer.pits[currentIndex]++;
        }
    }, [ isGameOwner ])
    const handleAllPitsEmpty = useCallback((gamer: Gamer, rival: Gamer) => {
        const isAllPitsEmpty = gamer.pits.every(pit => pit === 0);
        if (isAllPitsEmpty) {
            gamer.treasure += rival.pits.reduce((prev, currentValue) => (prev + currentValue), 0);
            rival.pits = rival.pits.map(_ => 0);
        }
        return isAllPitsEmpty;
    }, []);
    const updateFirebase = useCallback(async (currentGamer: Gamer, rival: Gamer, isLastStoneInTreasure: boolean, isAllPitsEmpty: boolean) => {
        await updateDoc(docRef, {
            "gamer1": isGameOwner ? currentGamer : rival,
            "gamer2": isGameOwner ? rival : currentGamer,
            "moveOrder": isLastStoneInTreasure ? currentGamer.id : rival.id,
            "isGameCompleted": isAllPitsEmpty,
            "winnerGamer": determineWinner(currentGamer, rival, isAllPitsEmpty)
        });
    }, [ isGameOwner, docRef, determineWinner ]);

    const handleBoundaryConditions = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, direction: Direction, isLastStone: boolean) => {
        let isLastStoneInTreasure = false;
        if ((currentIndex != TOP_BOUNDARY) && (currentIndex !== BOTTOM_BOUNDARY)) {
            return {
                currentIndex,
                direction,
                isLastStoneInTreasure,
                hasBoundary: false
            };
        }

        direction = direction === Direction.Top ? Direction.Bottom : Direction.Top;

        if (currentIndex == TOP_BOUNDARY) {
            currentIndex = 0;

            if (isGameOwner) {
                gamer.treasure++;
            } else {
                rival.pits[currentIndex]++;
                currentIndex++;
            }

            isLastStoneInTreasure = isLastStone && isGameOwner;

        } else if (currentIndex === BOTTOM_BOUNDARY) {
            currentIndex = 5;

            if (isGameOwner) {
                gamer.pits[currentIndex]++;
                currentIndex--;
            } else {
                gamer.treasure++;
            }

            isLastStoneInTreasure = isLastStone && !isGameOwner;
        }

        return {
            currentIndex,
            direction,
            isLastStoneInTreasure,
            hasBoundary: true
        };

    }, [ isGameOwner ])

    const handlePit = useCallback(async (pit: number, pitIndex: number) => {
        if (!hasRight || pit == 0) return;

        let direction = position;
        const newGamer = { ...gamer }
        const newRival = { ...rivalGamer }
        newGamer.pits[pitIndex] = 0;
        let currentIndex = pitIndex;
        let remainingStones = pit;
        const isSingleStone = remainingStones == SINGLE_STONE_THRESHOLD;
        let isLastStoneInTreasure = false;

        while (remainingStones > LAST_STONE_THRESHOLD) {
            remainingStones--;
            currentIndex = isSingleStone ? (direction == Direction.Top) ? currentIndex - 1 : currentIndex + 1 : currentIndex;
            const isLastStone = (remainingStones == LAST_STONE_THRESHOLD);
            const isDirectionTop = direction == Direction.Top;
            let hasBoundary = false;

            ({ currentIndex, direction, isLastStoneInTreasure, hasBoundary } = handleBoundaryConditions(newGamer, newRival, currentIndex, direction, isLastStone));

            if (hasBoundary) continue;

            handleUpdateCurrentPit(newGamer, newRival, currentIndex, isDirectionTop);
            handleIsLastStoneMakesRivalPitEven(newGamer, newRival, currentIndex, isLastStone, isDirectionTop);
            handleIsLastPitOneStone(newGamer, newRival, currentIndex, isLastStone);

            currentIndex += isSingleStone ? 0 : direction == Direction.Top ? -1 : 1;
        }

        const isAllPitsEmpty = handleAllPitsEmpty(newGamer, newRival);

        await updateFirebase(newGamer, newRival, isLastStoneInTreasure, isAllPitsEmpty)

    }, [
        hasRight,
        gamer,
        rivalGamer,
        position,
        updateFirebase,
        handleUpdateCurrentPit,
        handleIsLastStoneMakesRivalPitEven,
        handleIsLastPitOneStone,
        handleAllPitsEmpty,
        handleBoundaryConditions,
    ]);
    return (
        gamer.pits.map((pit: number, pitIndex: number) => (
            <Pit key={pitIndex}
                 pit={pit}
                 hasRight={hasRight}
                 onClick={() => handlePit(pit, pitIndex)}/>
        ))
    );
};