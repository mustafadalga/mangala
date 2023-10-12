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
export default function getPitThresholdByWindowSize(): PositionThreshold {
    if (window.innerWidth >= 1024) {
        return {
            minLeft: 25,
            minTop: 5,
            maxLeft: 60,
            maxTop: 60
        }
    } else if (window.innerWidth >= 768) {
        return {
            minLeft: 10,
            minTop: 15,
            maxLeft: 55,
            maxTop: 50
        }
    } else if (window.innerWidth >= 640) {
        return {
            minLeft: 10,
            minTop: 20,
            maxLeft: 55,
            maxTop: 50
        }
    } else {
        return {
            minLeft: 20,
            minTop: 10,
            maxLeft: 55,
            maxTop: 60
        }
    }
}
