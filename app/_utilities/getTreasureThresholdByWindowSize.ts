import { PositionThreshold } from "@/_types";

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