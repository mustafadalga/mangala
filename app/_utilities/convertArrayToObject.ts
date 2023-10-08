import { Pit, PitsRaw } from "@/_types";

export default function convertArrayToObject(arr: Pit[]): PitsRaw {
    return arr.reduce((prevPits, currentPit, index) => {
        prevPits[`pit${index + 1}` as keyof PitsRaw] = currentPit;
        return prevPits;
    }, {} as PitsRaw);
}