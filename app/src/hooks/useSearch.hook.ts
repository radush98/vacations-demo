import { useCallback, useState } from "react";
import { apiService } from "../services";
import type { GeoEntity } from "../interfaces";
import type { ERROR_CODES } from "../data";

export const useGeoSearch = () => {
    const [data, setData] = useState<GeoEntity[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorCode, setErrorCode] = useState<keyof typeof ERROR_CODES | null>(null);

    const searchGeo = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setErrorCode(null);
        try {
            const result = await apiService.searchGeo(searchQuery);
            setData(result);
        } catch (err) {
            setErrorCode('UNKNOWN');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getBasicResponse = useCallback(async () => {
        if (isLoading) return;
        if (data?.every(item => item.type === 'country')) return;

        setIsLoading(true);
        setErrorCode(null);

        try {
            const countries = await apiService.getCountries();
            setData(countries);
        } catch (err) {
            setErrorCode('UNKNOWN');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, data]);

    const clearData = useCallback(() => {
        setData(null);
        setErrorCode(null);
    }, []);

    return {
        searchGeo,
        getBasicResponse,
        clearData,
        errorCode,
        data,
        isLoading,
    }
}