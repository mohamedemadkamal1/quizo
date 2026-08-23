import { create } from 'axios';

import { applyApiRequestHeaders } from '@/services/api/request-headers';
import { getStoredLanguage } from '@/store/language.store';

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
  // Read at send time rather than at module load, so a service that was
  // written before a language change can never carry the previous language.
  applyApiRequestHeaders(config.headers, getStoredLanguage(), accessToken);

  // Query parameters are left exactly as the service passed them: the language
  // travels in the header only.
  return config;
});
