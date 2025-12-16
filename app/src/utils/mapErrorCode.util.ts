import type { ERROR_CODES } from "../data";
import type { ErrorResponse } from "../interfaces";

export const mapErrorToCode = (error: ErrorResponse): keyof typeof ERROR_CODES => {
    if (error.code === 404) return 'TOURS_NOT_FOUND';
    if (error.code === 425) return 'TOO_EARLY';
    if (error.code === 503) return 'RETRIES_EXHAUSTED';
    return 'UNKNOWN';
};