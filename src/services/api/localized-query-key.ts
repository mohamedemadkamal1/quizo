import type { AppLanguage } from '@/i18n/types';

export function createLocalizedQueryKey<
  const Parts extends readonly unknown[],
>(scope: string, language: AppLanguage, ...parts: Parts) {
  return [scope, language, ...parts] as const;
}

export function isLocalizedQueryKey(
  queryKey: readonly unknown[],
): boolean {
  return queryKey[1] === 'en' || queryKey[1] === 'ar';
}

