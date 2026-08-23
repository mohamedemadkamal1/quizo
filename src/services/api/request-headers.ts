import { AxiosHeaders } from 'axios';

import type { AppLanguage } from '@/i18n';

export const LANGUAGE_HEADER = 'lng';

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
