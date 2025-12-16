import { useState, useCallback } from "react";
import { pricesService } from "../services"
import { type ERROR_CODES } from "../data";
import type { GetSearchPricesResponse, StartSearchResponse, ErrorResponse } from "../interfaces";
import { mapErrorToCode } from "../utils";

export const useTours = () => {
    const [errorCode, setErrorCode] = useState<keyof typeof ERROR_CODES | null>(null);
    const [tokenData, setTokenData] = useState<StartSearchResponse | null>(null);
    const [tours, setTours] = useState<GetSearchPricesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPrices, setIsLoadingPrices] = useState(false);

    const resetState = useCallback(() => {
        setErrorCode(null);
        setTours(null);
        setTokenData(null);
    }, []);

    const startSearchPrices = useCallback(async (countryID: string) => {
        resetState();
        setIsLoading(true);

        try {
            const res = await pricesService.startSearchPrices(countryID);
            if (res) {
                setTokenData(res);
            }
        } catch (e) {
            setErrorCode('UNKNOWN');
        } finally {
            setIsLoading(false);
        }
    }, [resetState]);

    const getSearchPrices = useCallback(async (): Promise<GetSearchPricesResponse | ErrorResponse | null> => {
        if (!tokenData?.token) {
            return null;
        }

        setIsLoadingPrices(true);
        setErrorCode(null);

        try {
            const res = await pricesService.getSearchPrices(tokenData.token);

            if ('error' in res && res.error) {
                const errorCode = mapErrorToCode(res);
                setErrorCode(errorCode);
                return res;
            }

            if ('prices' in res && res.prices) {
                if (Object.keys(res.prices).length === 0) {
                    setErrorCode('TOURS_NOT_FOUND');
                    return null;
                }

                setTours(res);
                setErrorCode(null);
                return res;
            }

            return null;
        } catch (e) {
            setErrorCode('UNKNOWN');
            return null;
        } finally {
            setIsLoadingPrices(false);
        }
    }, [tokenData]);

    const searchTours = useCallback(async (countryID: string): Promise<GetSearchPricesResponse | ErrorResponse | null> => {
        resetState();
        setIsLoading(true);
        setIsLoadingPrices(true);

        try {
            const tokenResponse = await pricesService.startSearchPrices(countryID);
            
            if (!tokenResponse?.token) {
                setErrorCode('UNKNOWN');
                return null;
            }

            setTokenData(tokenResponse);
            setIsLoading(false);

            const result = await pricesService.pollSearchPrices(tokenResponse.token, tokenResponse.waitUntil);

            console.log(result);

            if (result && 'prices' in result) {
                if (Object.keys(result.prices).length === 0) {
                    setErrorCode('TOURS_NOT_FOUND');
                    return null;
                }
                setTours(result);
                setErrorCode(null);
                return result;
            }

            if (result && 'error' in result) {
                const errorCode = mapErrorToCode(result);
                setErrorCode(errorCode);
                return result;
            }

            return null;
        } catch (e) {
            setErrorCode('UNKNOWN');
            return null;
        } finally {
            setIsLoading(false);
            setIsLoadingPrices(false);
        }
    }, [resetState]);

    return {
        startSearchPrices,
        getSearchPrices,
        searchTours,
        errorCode,
        tokenData,
        tours,
        isLoading,
        isLoadingPrices,
    };
};
