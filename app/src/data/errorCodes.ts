export const ERROR_CODES = {
    UNKNOWN: {
        title: 'Помилка',
        description: 'Сталася невідома помилка',
    },
    NOT_FOUND: {
        title: 'Упс...',
        description: 'Нічого не знайдено',
    },
    TOURS_NOT_FOUND: {
        title: 'Турів не знайдено',
        description: 'За вашим запитом турів не знайдено. Спробуйте змінити критерії пошуку',
    },
    TOO_EARLY: {
        title: 'Попередній запит не завершився',
        description: 'Будь ласка, зачекайте доки виконається минулий запит'
    },
    RETRIES_EXHAUSTED: {
        title: 'Помилка завантаження',
        description: 'Не вдалося завантажити дані після кількох спроб. Будь ласка, спробуйте ще раз'
    }
}