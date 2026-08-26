import { create } from 'axios';

import { prepareApiRequestHeaders } from '@/services/api/request-headers';
import {
  getStoredLanguage,
  hydrateLanguage,
} from '@/store/language.store';

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

apiClient.interceptors.request.use(async (config) => {
  await prepareApiRequestHeaders(config.headers, {
    waitForLanguageHydration: hydrateLanguage,
    getLanguage: getStoredLanguage,
    getAccessToken: () => accessToken,
  });

  // Read at send time rather than at module load, so a service that was
  // written before a language change can never carry the previous language.
  // Query parameters are left exactly as the service passed them: the language
  // travels in the header only.
  return config;
});
