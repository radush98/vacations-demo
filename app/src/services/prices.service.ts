//@ts-ignore
import { startSearchPrices as startSearchPricesRequest, getSearchPrices as getSearchPricesRequest } from '../../../backend/api.js';
import { DEFAULT_ATTEMPTS, DEFAULT_TIMEOUT } from '../data/constants.js';
import type { StartSearchResponse, GetSearchPricesResponse, ErrorResponse } from '../interfaces/Price.js';
import { request, waitUntil } from '../utils';

class PricesService {
    constructor() { }

    async startSearchPrices(countryID: string): Promise<StartSearchResponse> {
        const res = await request<StartSearchResponse>(() => startSearchPricesRequest(countryID));

        if (!res.success) {
            throw new Error(res.error || `Server error: ${res.status}`);
        }

        if (res.data) {
            return res.data as StartSearchResponse;
        }

        throw new Error('Invalid response from server');
    }

    async getSearchPrices(token: string): Promise<GetSearchPricesResponse | ErrorResponse> {
        const res = await request<GetSearchPricesResponse | ErrorResponse>(() => getSearchPricesRequest(token));

        if (!res.success) {
            if (res.status === 425 || res.status === 404) {
                return res.data as ErrorResponse;
            }
            throw new Error((res.data as ErrorResponse)?.message || `Server error: ${res.status}`);
        }

        if (res.data) {
            return res.data as GetSearchPricesResponse;
        }

        throw new Error('Invalid response from server');
    }

    async pollSearchPrices(
        token: string,
        waitUntilDate: string,
        maxAttempts: number = DEFAULT_ATTEMPTS
    ): Promise<GetSearchPricesResponse | ErrorResponse | null> {
        await waitUntil(waitUntilDate);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const result = await this.getSearchPrices(token);

            if ('prices' in result && result.prices) {
                return result;
            }

            if ('error' in result && result.error && result.code === 425) {
                const nextWaitTime = result.waitUntil
                    ? new Date(result.waitUntil).getTime() - Date.now()
                    : DEFAULT_TIMEOUT;
                await new Promise(resolve => setTimeout(resolve, Math.max(nextWaitTime, DEFAULT_TIMEOUT)));
                continue;
            }

            return result;
        }

        return {
            code: 503,
            error: true,
            message: 'Retries exhausted'
        } as ErrorResponse;
    };
}

export const pricesService = new PricesService();