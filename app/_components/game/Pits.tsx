import { useCallback } from "react";
import { useParams } from "next/navigation";
import { doc, DocumentReference, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import useAuth from "@/_providers/auth/useAuth";
import convertArrayToObject from "@/_utilities/convertArrayToObject";
import { Gamer, Pit as IPit, Stone } from "@/_types";
import { Direction } from "@/_enums";
import Pit from "./Pit";

interface Props {
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
export default function Pits({ gamer, rivalGamer, gameOwner, moveOrder, isCurrentGamerPits, position, isGameStarted, isGameCompleted }: Props) {
    const { id: roomID }: { id: string } = useParams();
    const db = getFirestore()

    const { user } = useAuth();
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
        const isLastStoneMakesRivalPitEven = isLastStone && ((isDirectionTop && !isGameOwner) || (!isDirectionTop && isGameOwner)) && rival.pits[currentIndex].length % 2 === 0;
        if (isLastStoneMakesRivalPitEven) {
            rival.pits[currentIndex].map(stone => gamer.treasure.push(stone))
            rival.pits[currentIndex] = [];
        }
    }, [ isGameOwner ]);

    const handleIsLastPitOneStone = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, isLastStone: boolean) => {
        const isLastPitOneStone = gamer.pits[currentIndex].length === SINGLE_STONE_THRESHOLD;
        const hasRivalPitOneStone = rival.pits[currentIndex].length > LAST_STONE_THRESHOLD;
        if (isLastPitOneStone && isLastStone && hasRivalPitOneStone) {
            gamer.pits[currentIndex].concat(rival.pits[currentIndex]).map(stone => gamer.treasure.push(stone));
            gamer.pits[currentIndex] = [];
            rival.pits[currentIndex] = [];
        }
    }, []);
    const handleUpdateCurrentPit = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, selectedPit: IPit, isDirectionTop: boolean) => {
        const stone: Stone = selectedPit.shift()!;

        if (isGameOwner) {
            isDirectionTop ? gamer.pits[currentIndex].push(stone) : rival.pits[currentIndex].push(stone);
        } else {
            isDirectionTop ? rival.pits[currentIndex].push(stone) : gamer.pits[currentIndex].push(stone);
        }
    }, [ isGameOwner ])
    const handleAllPitsEmpty = useCallback((gamer: Gamer, rival: Gamer) => {
        const isAllPitsEmpty = gamer.pits.every(pit => pit.length == 0);
        if (isAllPitsEmpty) {
            rival.pits.map(pit => pit.map(stone => gamer.treasure.push(stone)))
            rival.pits = rival.pits.map(_ => []);
        }
        return isAllPitsEmpty;
    }, []);
    const updateFirebase = useCallback(async (currentGamer: Gamer, rival: Gamer, isLastStoneInTreasure: boolean, isAllPitsEmpty: boolean) => {

        await updateDoc(docRef, {
            "gamer1": isGameOwner ? {
                ...currentGamer,
                pits: convertArrayToObject(currentGamer.pits)
            } : {
                ...rival,
                pits: convertArrayToObject(rival.pits)
            },
            "gamer2": isGameOwner ? {
                ...rival,
                pits: convertArrayToObject(rival.pits)
            } : {
                ...currentGamer,
                pits: convertArrayToObject(currentGamer.pits)
            },
            "moveOrder": isLastStoneInTreasure ? currentGamer.id : rival.id,
            "isGameCompleted": isAllPitsEmpty,
            "winnerGamer": determineWinner(currentGamer, rival, isAllPitsEmpty),
            moveStartTimestamp: serverTimestamp(),
        });
    }, [ isGameOwner, docRef, determineWinner ]);

    const handleBoundaryConditions = useCallback((gamer: Gamer, rival: Gamer, currentIndex: number, selectedPit: IPit, direction: Direction, isLastStone: boolean) => {
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

        const stone: Stone = selectedPit.shift()!;

        if (currentIndex == TOP_BOUNDARY) {
            currentIndex = 0;
            if (isGameOwner) {
                gamer.treasure.push(stone);
            } else {
                rival.pits[currentIndex].push(stone);
                currentIndex++;
            }

            isLastStoneInTreasure = isLastStone && isGameOwner;

        } else if (currentIndex === BOTTOM_BOUNDARY) {
            currentIndex = 5;

            if (isGameOwner) {
                gamer.pits[currentIndex].push(stone);
                currentIndex--;
            } else {
                gamer.treasure.push(stone);
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

    const handlePit = useCallback(async (pit: IPit, pitIndex: number) => {
        if (!hasRight || pit.length == 0) return;

        let direction = position;
        const newGamer = { ...gamer }
        const newRival = { ...rivalGamer }
        const selectedPit: IPit = [ ...pit ];
        newGamer.pits[pitIndex] = [];
        let currentIndex = pitIndex;
        let remainingStones = pit.length;
        const isSingleStone = remainingStones == SINGLE_STONE_THRESHOLD;
        let isLastStoneInTreasure = false;

        while (remainingStones > LAST_STONE_THRESHOLD) {
            remainingStones--;
            currentIndex = isSingleStone ? (direction == Direction.Top) ? currentIndex - 1 : currentIndex + 1 : currentIndex;
            const isLastStone = (remainingStones == LAST_STONE_THRESHOLD);
            const isDirectionTop = direction == Direction.Top;
            let hasBoundary = false;

            ({ currentIndex, direction, isLastStoneInTreasure, hasBoundary } = handleBoundaryConditions(newGamer, newRival, currentIndex, selectedPit, direction, isLastStone));

            if (hasBoundary) continue;

            handleUpdateCurrentPit(newGamer, newRival, currentIndex, selectedPit, isDirectionTop);
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


    const createPitClickHandler = useCallback(
        (pit: IPit, index: number) => () => handlePit(pit, index),
        [ handlePit ]
    );
    return (
        gamer.pits.map((pit, index) => (
            <Pit key={index}
                 pit={pit}
                 onClick={createPitClickHandler(pit, index)}
                 hasRight={hasRight}
            />
        ))
    );
};