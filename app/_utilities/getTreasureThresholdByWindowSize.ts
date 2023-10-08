import { PositionThreshold } from "@/_types";

export default function getTreasureThresholdByWindowSize(): PositionThreshold {
    if (window.innerWidth >= 1024) {  // This is just an example breakpoint for a tablet
        return {
            minLeft: 10,
            minTop: 15,
            maxLeft: 70,
            maxTop: 80
        }
    } else {
        return {
            minLeft: 5,
            minTop: 10,
            maxLeft: 90,
            maxTop: 70
        }
    }
}