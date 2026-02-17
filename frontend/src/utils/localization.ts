const translations: Record<string, string> = {
    // General
    'unknown_error': 'Произошла неизвестная ошибка',
    'server_error': 'Ошибка сервера',
    'access_denied': 'Доступ запрещен',
    'authentication_invalid': 'Ошибка аутентификации',
    'authentication_invalid_blacklisted': 'Сессия истекла, пожалуйста, войдите снова',
    'user_not_found': 'Пользователь не найден',
    'user_logged_out': 'Вы успешно вышли из системы',

    // Validation
    'skip_is_out_of_range': 'Неверное значение для `skip`',
    'limit_is_out_of_range': 'Неверное значение для `limit`',
    'cast_error': 'Неверный формат идентификатора',

    // Auth
    'email_password_required': 'Пожалуйста введите почту и пароль',
    'invalid_credentials': 'Неверный email или пароль',
    'email_already_exists': 'Пользователь с таким email уже существует',
    'Invalid credentials': 'Неверный email или пароль',
    'Please provide name, email, and password': 'Пожалуйста, укажите имя, email и пароль',
    'Please provide email and password': 'Пожалуйста, укажите email и пароль',

    // Client
    'provide_name_email_password': 'Пожалуйста введите имя, почту и пароль',
    'incorrect_name': 'Некорректное имя (от 3 до 150 символов)',
    'incorrect_email_address': 'Некорректный email адрес',
    'incorrect_phone_number': 'Некорректный номер телефона',
    'incorrect_password': 'Пароль должен содержать цифру, буквы в разном регистре, специальный символ (!@#$%^&*) и быть длиннее 8 символов',
    'either_phone_or_email_required': 'Необходимо указать email или телефон',

    // Task
    'incorrect_task_name': 'Некорректное название задачи (от 3 до 150 символов)',
    'client_id_required': 'Необходимо выбрать клиента',
};

export const i18n = (key: string | null): string => {
    if (!key) return 'i18n_unknown_key';
    return translations[key] || key;
};