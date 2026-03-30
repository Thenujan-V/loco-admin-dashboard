import { useEffect, useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useLocalStorage<T extends Record<string, any>>(key: string, initialState: T) {
    const [state, setState] = useState<T>(initialState);

    useEffect(() => {
        const restored = getStorage(key);

        if (restored) {
            setState((prevValue) => ({
                ...prevValue,
                ...restored,
            }));
        }
    }, [key]);

    const updateState = useCallback(
        (updateValue: Partial<T>) => {
            setState((prevValue) => {
                setStorage(key, {
                    ...prevValue,
                    ...updateValue,
                });

                return {
                    ...prevValue,
                    ...updateValue,
                };
            });
        },
        [key]
    );

    const update = useCallback(
        (name: string, updateValue: any) => {
            updateState({
                [name]: updateValue,
            } as Partial<T>);
        },
        [updateState]
    );

    const reset = useCallback(() => {
        removeStorage(key);
        setState(initialState);
    }, [initialState, key]);

    return {
        state,
        update,
        reset,
    };
}

// ----------------------------------------------------------------------

export const getStorage = (key: string): any => {
    let value = null;

    try {
        const result = window.localStorage.getItem(key);

        if (result) {
            value = JSON.parse(result);
        }
    } catch (error) {
        console.error(error);
    }

    return value;
};

export const setStorage = (key: string, value: any): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(error);
    }
};

export const removeStorage = (key: string): void => {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(error);
    }
};
