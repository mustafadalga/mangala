import { Pits, PitsRaw } from "@/_types";

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