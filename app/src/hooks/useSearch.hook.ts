import { useCallback, useEffect, useState } from "react";
import { apiService } from "../services";
import type { GeoEntity } from "../interfaces";
import type { ERROR_CODES } from "../data";

export const useGeoSearch = () => {
    const [data, setData] = useState<GeoEntity[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorCode, setErrorCode] = useState<keyof typeof ERROR_CODES | null>(null);
    const [value, setValue] = useState<string>('');
    const [entity, setEntityState] = useState<GeoEntity | null>(null);

    const setEntity = useCallback((newEntity: GeoEntity | null) => {
        setEntityState((prevEntity) => {
            if (JSON.stringify(prevEntity) === JSON.stringify(newEntity)) {
                return prevEntity;
            }
            return newEntity;
        });
    }, []);

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

    useEffect(() => {
        if (!value) return;

        const timer = setTimeout(() => {
            searchGeo(value);
        }, 400);

        return () => clearTimeout(timer);
    }, [value, searchGeo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (e.target.value === '') {
            getBasicResponse()
        }
        if (entity) {
            setEntity(null)
        }
    };

    const handleClear = () => {
        setValue('');
        setData(null);
        setErrorCode(null);
        getBasicResponse();
    };

    const getBasicResponse = async () => {
        if (isLoading) return;
        if (data?.every(item => item.type === 'country')) return;

        setIsLoading(true);
        setErrorCode(null);

        try {
            const data = await apiService.getCountries();
            setData(data);
        } catch (err) {
            setErrorCode('UNKNOWN');
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleChange,
        handleClear,
        getBasicResponse,
        errorCode,
        value,
        data,
        isLoading,
        setValue,
        entity,
        setEntity
    }
}