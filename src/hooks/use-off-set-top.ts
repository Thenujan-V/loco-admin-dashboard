import { useScroll } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useOffSetTop(top: number = 0, options?: Parameters<typeof useScroll>[0]) {
    const { scrollY } = useScroll(options);

    const [value, setValue] = useState(false);

    const onOffSetTop = useCallback(() => {
        scrollY.on('change', (scrollHeight: number) => {
            if (scrollHeight > top) {
                setValue(true);
            } else {
                setValue(false);
            }
        });
    }, [scrollY, top]);

    useEffect(() => {
        onOffSetTop();
    }, [onOffSetTop]);

    const memoizedValue = useMemo(() => value, [value]);

    return memoizedValue;
}
