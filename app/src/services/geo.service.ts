//@ts-ignore
import { searchGeo as searchGeoRequest } from '../../../backend/api.js';
import type { GeoEntity } from '../interfaces/Geo.js';
import { request } from '../utils';

class GeoService {
    constructor() { }

    async searchGeo(search: string): Promise<GeoEntity[]> {
        const res = await request<Record<string, GeoEntity>>(() => searchGeoRequest(search));

        if (!res.success) {
            throw new Error(res.error || `Server error: ${res.status}`);
        }

        if (res.data) {
            return Object.values(res.data);
        }

        return [];
    }
}

export const geoService = new GeoService();