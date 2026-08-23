import { create } from 'axios';

import { getStoredLanguage } from '@/store/language.store';

/** The header the backend reads to localize its responses. */
const LANGUAGE_HEADER = 'lng';

let accessToken: string | null = null;

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
const apiBaseUrl = configuredApiUrl
  ? configuredApiUrl.endsWith('/api')
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : undefined;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export const apiClient = create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Read at send time rather than at module load, so a service that was
  // written before a language change can never carry the previous language.
  //
  // Axios normalizes `config.headers` into an `AxiosHeaders` instance before
  // request interceptors run — which is why its type is declared that way — so
  // `set` is available here. It also replaces any existing value
  // case-insensitively, meaning a request can never leave with two conflicting
  // language headers.
  config.headers.set(LANGUAGE_HEADER, getStoredLanguage());

  // Query parameters are left exactly as the service passed them: the language
  // travels in the header only.
  return config;
});
