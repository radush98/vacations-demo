import { ICONS } from "../data"
import type { GeoEntity } from "../interfaces"

export const getIcon = (entity: GeoEntity) => {
    return entity.type !== 'country' ?
        ICONS[entity.type] :
        entity.flag
}