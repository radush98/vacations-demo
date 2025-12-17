import type { GeoEntity } from "../interfaces";

export type LocationParams =
    | { type: 'country'; countryId: string }
    | { type: 'city'; countryId: string; cityId: number }
    | { type: 'hotel'; countryId: string; cityId: number; hotelId: number };

export const buildLocationParams = (entity: GeoEntity): LocationParams => {
    if (entity.type === 'country') {
        return {
            type: entity.type,
            countryId: entity.id,
        }
    } else if (entity.type === 'city') {
        return {
            type: entity.type,
            countryId: entity.countryId,
            cityId: entity.id
        }
    } else {
        return {
            type: entity.type,
            countryId: entity.countryId,
            cityId: entity.cityId,
            hotelId: entity.id
        }
    }
}