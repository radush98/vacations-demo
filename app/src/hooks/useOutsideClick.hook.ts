import { useEffect, type RefObject } from 'react';

//TO DO: attach this logic to dropdown directly
export const useOutsideClick = <T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void
): void => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, callback]);
}