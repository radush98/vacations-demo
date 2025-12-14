export type GeoEntityType = 'country' | 'city' | 'hotel';

export type Country = { id: string; name: string; flag: string };
export type City = { id: number; name: string };
export type Hotel = {
    id: number;
    name: string;
    img: string;
    cityId: number;
    cityName: string;
    countryId: string;
    countryName: string;
};

export type GeoCountry = Country & { type: "country" };
export type GeoCity = City & { type: "city" };
export type GeoHotel = Hotel & { type: "hotel" };

export type GeoEntity =
    | GeoCountry
    | GeoCity
    | GeoHotel;

