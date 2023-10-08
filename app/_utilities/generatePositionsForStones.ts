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

export default function generatePositionsForStones({
                                               minLeft,
                                               minTop,
                                               maxLeft,
                                               maxTop
                                           }: PositionThreshold): Position[] {
    const usedPositions: Position[] = [];
    const pitCount = 48;

    Array.from({ length: pitCount }).forEach(_ => {
        let position: Position;
        let tries = 0;
        const maxTries = 1000;
        do {
            position = {
                left: generateRandomPosition(minLeft, maxLeft),
                top: generateRandomPosition(minTop, maxTop)
            };
            tries++;
            if (tries > maxTries) {
                break;
            }

        } while (!isValidPosition(position, usedPositions));

        usedPositions.push(position);
    });

    return usedPositions;
}