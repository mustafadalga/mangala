import { Pits, PitsRaw } from "@/_types";

/**
 * Converts an object representation of pits (PitsRaw) into an array of pits (Pits).
 *
 * @param pits - An object representation (PitsRaw) of pits to be converted.
 * @returns An array of pits (Pits) based on the input object representation.
 */
export default function convertObjectToArray(pits: PitsRaw): Pits {
    const orderedArray = [];
    for (let pitIndex = 1; pitIndex <= Object.keys(pits).length; pitIndex++) {
        const pitKey = `pit${pitIndex}` as keyof PitsRaw;
        if (pits[pitKey]) {
            orderedArray.push(pits[pitKey]);
        }
    }
    return orderedArray;
}