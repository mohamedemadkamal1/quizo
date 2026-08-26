import { AxiosHeaders } from 'axios';

import type { AppLanguage } from '@/i18n';

export const LANGUAGE_HEADER = 'lng';

export type ApiRequestHeaderDependencies = {
  waitForLanguageHydration: () => Promise<void>;
  getLanguage: () => AppLanguage;
  getAccessToken: () => string | null;
};

/** Applies Quizo-owned headers without replacing any caller-provided headers. */
export function applyApiRequestHeaders(
  headers: AxiosHeaders,
  language: AppLanguage,
  accessToken: string | null,
): AxiosHeaders {
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // `set` replaces an existing value case-insensitively, so a request cannot
  // leave with two conflicting language headers.
  headers.set(LANGUAGE_HEADER, language);

  return headers;
}

/**
 * Prevents the first startup request from observing Zustand's temporary
 * English default before the persisted/device language has been restored.
 */
export async function prepareApiRequestHeaders(
  headers: AxiosHeaders,
  dependencies: ApiRequestHeaderDependencies,
): Promise<AxiosHeaders> {
  await dependencies.waitForLanguageHydration();

  return applyApiRequestHeaders(
    headers,
    dependencies.getLanguage(),
    dependencies.getAccessToken(),
  );
}
