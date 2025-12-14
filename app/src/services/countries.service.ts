//@ts-ignore
import { getCountries as getCountriesRequest } from '../../../backend/api.js';
import type { Country, GeoCountry } from '../interfaces/Geo.js';
import { request } from '../utils';

class CountriesService {
    constructor() { }

    async getCountries(): Promise<GeoCountry[]> {
        const res = await request<Record<string, Country>>(() => getCountriesRequest());

        if (!res.success) {
            throw new Error(res.error || `Server error: ${res.status}`);
        }

        if (res.data) {
            return Object.values(res.data).map((entity) => ({
                ...entity,
                type: 'country'
            }));
        }

        return [];
    }
}

export const countriesService = new CountriesService();