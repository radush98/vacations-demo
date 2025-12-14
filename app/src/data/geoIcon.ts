import { faCity, faFlag, faHotel, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { GeoEntityType } from "../interfaces";

export const ICONS: Record<GeoEntityType, IconDefinition> = {
    country: faFlag,
    city: faCity,
    hotel: faHotel
}