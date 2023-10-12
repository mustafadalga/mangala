import { useRef } from 'react';
import { isEqual, cloneDeep } from 'lodash';

/**
 * Custom hook to memorize a value deeply using lodash's `isEqual` and `cloneDeep` functions.
 * It ensures that the returned reference only changes if the deep value of the provided input changes.
 *
 * @param value - The value to be deeply compared and memorized.
 * @returns The memorized value. If the input value changes (deeply), a new reference will be returned.
 *
 * @template T - The type of the value to be memorized.
 */
export default function useDeepCompareMemoize<T>(value: T): T {
    const ref=useRef<T>(value);

    if (!isEqual(value, ref.current)) {
        ref.current = cloneDeep(value);
    }
    return ref.current!;
}
