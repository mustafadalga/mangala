import { Pit, PitsRaw } from "@/_types";

/**
 * Converts an array of pits into an object representation of pits (PitsRaw).
 *
 * @param arr - An array of pits to be converted.
 * @returns An object representation (PitsRaw) of the input array of pits.
 */
export default function convertArrayToObject(arr: Pit[]): PitsRaw {
    return arr.reduce((prevPits, currentPit, index) => {
        prevPits[`pit${index + 1}` as keyof PitsRaw] = currentPit;
        return prevPits;
    }, {} as PitsRaw);
}