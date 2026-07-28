import axios from 'axios';

import { installAuthMocks } from './mock-auth';

let accessToken: string | null = null;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

if (process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true') {
  installAuthMocks(apiClient);
}
