import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import generatePositionsForStones from "@/_utilities/generatePositionsForStones";
import { PositionThreshold, Stone, StoneWithPosition } from "@/_types";

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
