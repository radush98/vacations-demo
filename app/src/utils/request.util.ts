export const request = async <T>(callback: () => Promise<any>): Promise<{
    success: boolean,
    status?: number,
    data?: T | T[],
    error?: string
}> => {
    try {
        const response = await callback();

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: 'Сталася помилка'
            }
        }

        const data = await response.json();

        return {
            success: true,
            status: response.status,
            data: data
        }

    } catch (error) {
        return {
            success: false,
            error: error as string
        }
    }
}