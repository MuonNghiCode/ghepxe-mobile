export * from './api';
export { default as DEBOUNCE_DELAYS } from './debounce';

export const APP_CONFIG = {
  NAME: 'GhepXe',
  VERSION: '1.0.0',
  DESCRIPTION: 'Ứng dụng ghép chuyến nhanh chóng và tiện lợi',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_RATING: 1,
  MAX_RATING: 5,
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: 'LoginScreen',
    REGISTER: 'RegisterScreen',
    FORGOT_PASSWORD: 'ForgotPasswordScreen',
  },
  MAIN: {
    HOME: "HomeScreen",
    PROFILE: 'ProfileScreen',
    SETTINGS: 'SettingsScreen',
  },
} as const;
