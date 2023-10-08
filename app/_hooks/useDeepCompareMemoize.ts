import { useRef } from 'react';
import { isEqual, cloneDeep } from 'lodash';

export default function useDeepCompareMemoize<T>(value: T): T {
    const ref=useRef<T>(value);

    if (!isEqual(value, ref.current)) {
        ref.current = cloneDeep(value);
    }
    return ref.current!;
}
