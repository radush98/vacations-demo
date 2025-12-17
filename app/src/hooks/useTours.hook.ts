import { useState, useCallback } from "react";
import { apiService } from "../services"
import { type ERROR_CODES } from "../data";
import type { ErrorResponse, TourCard } from "../interfaces";
import type { GeoEntity } from "../interfaces";
import { mapErrorToCode } from "../utils";

export const useTours = () => {
    const [errorCode, setErrorCode] = useState<keyof typeof ERROR_CODES | null>(null);
    const [tours, setTours] = useState<TourCard[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSearchedEntity, setLastSearchedEntity] = useState<GeoEntity | null>(null);

    const resetState = useCallback(() => {
        setErrorCode(null);
        setTours(null);
    }, []);

    const searchTours = useCallback(async (entity: GeoEntity): Promise<TourCard[] | null> => {
        if (JSON.stringify(lastSearchedEntity) === JSON.stringify(entity)) {
            return Promise.resolve(tours);
        }

        setLastSearchedEntity(entity);
        resetState();
        setIsLoading(true);

        try {
            const tourResults = await apiService.searchTours(entity);
            setTours(tourResults);
            setErrorCode(null);
            return tourResults;
        } catch (e) {
            const errorCode = (e as any)?.code && (e as any)?.error 
                ? mapErrorToCode(e as ErrorResponse) 
                : 'UNKNOWN';
            setErrorCode(errorCode);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [resetState, lastSearchedEntity, tours]);

    return {
        searchTours,
        errorCode,
        tours,
        isLoading,
    };
};
