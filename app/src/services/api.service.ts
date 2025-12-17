//@ts-ignore
import {
    getCountries as getCountriesRequest,
    searchGeo as searchGeoRequest,
    getHotels as getHotelsRequest,
    getHotel as getHotelRequest,
    getPrice as getPriceRequest,
    startSearchPrices as startSearchPricesRequest,
    getSearchPrices as getSearchPricesRequest,
} from '../../../backend/api.js';
import { DEFAULT_ATTEMPTS, DEFAULT_TIMEOUT } from '../data/constants.js';
import type { Country, GeoCountry, GeoEntity, Hotel, HotelDetail } from '../interfaces/Geo.js';
import type { StartSearchResponse, GetSearchPricesResponse, ErrorResponse, TourCard, PriceOffer } from '../interfaces/Price.js';
import { request, waitUntil, buildLocationParams, type LocationParams } from '../utils';

class ApiService {
    private hotelsCache = new Map<string, Record<string, Hotel>>();

    private createErrorResponse(code: number, message: string): ErrorResponse {
        return { code, error: true, message };
    }

    private buildTourCards(
        hotels: Record<string, Hotel>,
        pricesResult: GetSearchPricesResponse,
        locationParams: LocationParams,
        countryFlagMap: Map<string, string>
    ): TourCard[] {
        let filteredHotels = Object.values(hotels);
        
        if (locationParams.type === 'hotel') {
            filteredHotels = filteredHotels.filter(hotel => hotel.id === locationParams.hotelId);
        } else if (locationParams.type === 'city') {
            filteredHotels = filteredHotels.filter(hotel => hotel.cityId === locationParams.cityId);
        }

        return filteredHotels.flatMap(hotel => {
            const hotelPrices = Object.values(pricesResult.prices).filter(
                price => price.hotelID === hotel.id.toString()
            );
            const flag = countryFlagMap.get(hotel.countryId) || '';
            
            return hotelPrices.map(price => ({
                hotel,
                price,
                countryFlag: flag
            }));
        });
    }

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

    async getHotels(countryID: string): Promise<Record<string, Hotel>> {
        if (this.hotelsCache.has(countryID)) {
            return this.hotelsCache.get(countryID)!;
        }

        const res = await request<Record<string, Hotel>>(() => getHotelsRequest(countryID));

        if (!res.success) {
            throw new Error(res.error || `Server error: ${res.status}`);
        }

        const hotels = res.data ? (res.data as Record<string, Hotel>) : {};
        this.hotelsCache.set(countryID, hotels);
        return hotels;
    }

    async getHotel(hotelId: number | string): Promise<HotelDetail> {
        try {
            const id = typeof hotelId === 'string' ? Number(hotelId) : hotelId;
            const res = await request<HotelDetail | ErrorResponse>(() => getHotelRequest(id));

            if (!res.success) {
                if (res.status === 404) {
                    const errorData = res.data as ErrorResponse;
                    throw {
                        code: 404,
                        error: true,
                        message: errorData?.message || res.error || 'Hotel not found'
                    } as ErrorResponse;
                }
                throw new Error(res.error || `Server error: ${res.status}`);
            }

            if (res.data) {
                const data = res.data as HotelDetail | ErrorResponse;
                if ('error' in data && data.error) {
                    throw data as ErrorResponse;
                }
                return data as HotelDetail;
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            if (error && typeof error === 'object' && 'error' in error && 'code' in error) {
                throw error;
            }
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to load hotel');
        }
    }

    async getPrice(priceId: string): Promise<PriceOffer> {
        const res = await request<PriceOffer | ErrorResponse>(() => getPriceRequest(priceId));

        if (!res.success) {
            if (res.status === 404) {
                const errorData = res.data as ErrorResponse;
                throw {
                    code: 404,
                    error: true,
                    message: errorData?.message || res.error || 'Price not found'
                } as ErrorResponse;
            }
            throw new Error(res.error || `Server error: ${res.status}`);
        }

        if (res.data) {
            const data = res.data as PriceOffer | ErrorResponse;
            if ('error' in data && data.error) {
                throw data as ErrorResponse;
            }
            return data as PriceOffer;
        }

        throw new Error('Invalid response from server');
    }

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
    }

    async searchTours(entity: GeoEntity): Promise<TourCard[]> {
        const locationParams = buildLocationParams(entity);
        const tokenResponse = await this.startSearchPrices(locationParams.countryId);
        
        if (!tokenResponse?.token) {
            throw this.createErrorResponse(400, 'Failed to start price search');
        }

        const pricesResult = await this.pollSearchPrices(tokenResponse.token, tokenResponse.waitUntil);

        if (!pricesResult || !('prices' in pricesResult) || !pricesResult.prices) {
            throw this.createErrorResponse(503, 'Failed to get prices');
        }

        if ('error' in pricesResult && pricesResult.error) {
            throw pricesResult;
        }

        const [hotels, countries] = await Promise.all([
            this.getHotels(locationParams.countryId),
            this.getCountries()
        ]);
        
        const countryFlagMap = new Map(countries.map(country => [country.id, country.flag]));

        const tourCards = this.buildTourCards(hotels, pricesResult, locationParams, countryFlagMap);

        if (tourCards.length === 0) {
            throw this.createErrorResponse(404, 'No tours found');
        }

        return tourCards;
    }
}

export const apiService = new ApiService();

