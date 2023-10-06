import { Position, PositionThreshold } from "@/_types";

export function generateRandomPosition(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


export function isValidPosition(position: Position, usedPositions: Position[]): boolean {
    let GAP_THRESHOLD = 10;
    for (let used of usedPositions) {
        if (Math.abs(used.left - position.left) < GAP_THRESHOLD && Math.abs(used.top - position.top) < GAP_THRESHOLD) {
            return false;
        }
    }
    return true;
}

export function generatePositionsForStones(length: number, {
    minLeft,
    minTop,
    maxLeft,
    maxTop
}: PositionThreshold): Position[] {
    const usedPositions: Position[] = [];
    Array.from({ length }).forEach(() => {
        let position;
        let tries = 0;
        const maxTries = 1000;
        do {
            position = {
                left: generateRandomPosition(minLeft, maxLeft),
                top: generateRandomPosition(minTop, maxTop)
            };
            tries++;
            if (tries > maxTries) {
                position = usedPositions[usedPositions.length - 1] || { left: maxLeft - 10, top: maxTop - 10 }; // Use last valid position or default if none
                break;
            }

        } while (!isValidPosition(position, usedPositions));

        usedPositions.push(position);
    });

    return usedPositions
}