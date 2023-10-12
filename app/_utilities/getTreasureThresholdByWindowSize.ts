import { PositionThreshold } from "@/_types";

/**
 * Computes the position thresholds based on the current window's width.
 *
 * This function defines position boundaries for different screen sizes
 * which can be useful for responsive design or adjusting game mechanics
 * based on the screen size.
 *
 * @returns A `PositionThreshold` object containing min and max coordinates for both left and top.
 */
export default function getTreasureThresholdByWindowSize(): PositionThreshold {
    if (window.innerWidth >= 1024) {
        return {
            minLeft: 10,
            minTop: 15,
            maxLeft: 70,
            maxTop: 80
        }
    }  else if (window.innerWidth >= 768) {
        return {
            minLeft: 10,
            minTop: 10,
            maxLeft: 90,
            maxTop: 65
        }
    }else {
        return {
            minLeft: 5,
            minTop: 10,
            maxLeft: 90,
            maxTop: 65
        }
    }
}