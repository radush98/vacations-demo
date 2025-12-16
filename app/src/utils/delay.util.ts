export const waitUntil = (waitUntilDate: string): Promise<void> => {
    const waitTime = new Date(waitUntilDate).getTime() - Date.now();
    return new Promise((resolve) => {
        setTimeout(resolve, Math.max(waitTime, 0));
    });
};