import { ONE_DAY } from "../data"

export const calculateDaysAmount = (startDate: string, endDate: string) => {
    return Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / ONE_DAY
    )
}