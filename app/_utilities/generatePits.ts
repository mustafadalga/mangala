import { MutableRefObject } from "react";
import { Pit } from "@/_types";
import convertArrayToObject from "./convertArrayToObject";

/**
 * Generates a random stone color based on a predefined set of TailwindCSS colors.
 *
 * @returns A randomly selected TailwindCSS color string.
 */
function generateStoneColor() {
    const tailwindStoneColors = [
        "bg-[radial-gradient(circle_at_30%_30%,rgb(99,102,241),rgb(59,130,246)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(129,140,248),rgb(55,48,163)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(253,164,175),rgb(225,29,72)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(254,240,138),rgb(234,179,8)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(74,222,128),rgb(22,163,74)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(45,212,191),rgb(15,118,110)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(34,211,238),rgb(22,78,99)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(99,102,241),rgb(59,130,246)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(129,140,248),rgb(55,48,163)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(253,164,175),rgb(225,29,72)_70%)]",
        "bg-[radial-gradient(circle_at_30%_30%,rgb(254,240,138),rgb(234,179,8)_70%)]",
    ];

    return tailwindStoneColors[Math.floor(Math.random() * tailwindStoneColors.length)];
}

/**
 * Generates pits filled with stones. Each pit contains a set number of stones.
 *
 * This function also updates the provided stone index reference, so that the next time
 * it's used, the stones will have unique, incremented indices.
 *
 * @param currentStoneIndex - A mutable reference to the current stone index.
 *                            Used to ensure that stones get unique indices.
 * @returns An object representation of pits.
 */
export default function generatePits(currentStoneIndex: MutableRefObject<number>) {
    const pitCount = 6;
    const stoneCount = 4;

    let no = currentStoneIndex.current
    const pits = Array.from({ length: pitCount }).reduce((prevPits: Pit[], _) => {

        const pit = Array.from({ length: stoneCount }).reduce((prevPit: Pit, _) => {
            prevPit.push({
                no,
                color: generateStoneColor(),
            });
            no++;
            return prevPit
        }, []);

        prevPits.push(pit);
        return prevPits

    }, []);

    currentStoneIndex.current = no;
    return convertArrayToObject(pits)
}