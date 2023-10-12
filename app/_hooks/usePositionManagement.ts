import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import generatePositionsForStones from "@/_utilities/generatePositionsForStones";
import { PositionThreshold, Stone, StoneWithPosition } from "@/_types";

/**
 * Custom hook to manage and generate positions for a set of items (like stones).
 *
 * This hook provides positions based on the current window size and updates those positions
 * if the window is resized. It ensures the positions are deeply compared and only updates
 * if there are deep changes.
 *
 * @param initialThresholdFunction - Function returning the current position thresholds.
 * @param itemType - Array of items to generate positions for.
 * @returns Array of items with their respective positions.
 */
export default function usePositionManagement(initialThresholdFunction: () => PositionThreshold, itemType: Stone[]) {
    const [ currentThreshold, setCurrentThreshold ] = useState<PositionThreshold>(initialThresholdFunction());
    const [ itemsWithPosition, setItemsWithPosition ] = useState(() => generatePositionsForStones(currentThreshold));
    const memorizedItems = useDeepCompareMemoize<Stone[]>(itemType);

    const stones = useMemo<StoneWithPosition[]>(() => memorizedItems.map((stone) => ({
        stone,
        position: itemsWithPosition[stone.no - 1]
    })), [ memorizedItems, itemsWithPosition ]);

    const handleResize = useCallback(() => {
        const newThreshold = initialThresholdFunction();

        if (!isEqual(currentThreshold, newThreshold)) {
            setCurrentThreshold(newThreshold);
            setItemsWithPosition(generatePositionsForStones(newThreshold));
        }
    }, [ currentThreshold, initialThresholdFunction ]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return stones;
}
