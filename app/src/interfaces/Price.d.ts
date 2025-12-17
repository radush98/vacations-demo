import type { Hotel } from './Geo';

export type PriceOffer = {
    id: string;
    amount: number;
    currency: "usd";
    startDate: string;
    endDate: string;
    hotelID?: string;
};

export type PricesMap = Record<string, PriceOffer>;

export type StartSearchResponse = {
    token: string;
    waitUntil: string;
};

export type GetSearchPricesResponse = {
    prices: PricesMap;
};

export type ErrorResponse = {
    code: number;
    error: true;
    message: string;
    waitUntil?: string;
};

export type TourCard = {
    hotel: Hotel;
    price: PriceOffer;
    countryFlag: string;
};


