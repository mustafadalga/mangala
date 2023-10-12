import { Position, PositionThreshold } from "@/_types";

/**
 * Generates a random position between the given min and max values.
 *
 * @param min - The minimum value for the random position.
 * @param max - The maximum value for the random position.
 * @returns A randomly generated position between the min and max values.
 */
export function generateRandomPosition(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Checks if the given position is valid based on a set of already used positions.
 *
 * A position is considered invalid if it's too close to any of the used positions.
 *
 * @param position - The position to validate.
 * @param usedPositions - An array of positions that have already been used.
 * @returns `true` if the position is valid, `false` otherwise.
 */
export function isValidPosition(position: Position, usedPositions: Position[]): boolean {
    let GAP_THRESHOLD = 10;
    for (let used of usedPositions) {
        if (Math.abs(used.left - position.left) < GAP_THRESHOLD && Math.abs(used.top - position.top) < GAP_THRESHOLD) {
            return false;
        }
    }
    return true;
}

/**
 * Generates an array of unique positions for stones based on the given position thresholds.
 *
 * The function attempts to generate positions in a way that they don't overlap or
 * get too close to each other. If a valid position can't be found within a certain
 * number of tries, the loop breaks to prevent infinite loops.
 *
 * @param minLeft - Minimum left coordinate.
 * @param minTop - Minimum top coordinate.
 * @param maxLeft - Maximum left coordinate.
 * @param maxTop - Maximum top coordinate.
 * @returns An array of unique positions for the stones.
 */
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