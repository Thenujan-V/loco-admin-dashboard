import { useEffect, useRef, useLayoutEffect, RefObject } from 'react';

// ----------------------------------------------------------------------

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useEventListener(
    eventName: string,
    handler: (event: Event) => void,
    element?: RefObject<HTMLElement | null>,
    options?: boolean | AddEventListenerOptions
): void {
    // Create a ref that stores handler
    const savedHandler = useRef(handler);

    useIsomorphicLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // Define the listening target
        const targetElement = element?.current || window;
        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }

        // Create event listener that calls handler function stored in ref
        const eventListener = (event: Event) => savedHandler.current(event);

        targetElement.addEventListener(eventName, eventListener, options);

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element, options]);
}
