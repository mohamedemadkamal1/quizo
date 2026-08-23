import { useMemo } from 'react';

import {
  formatNumber,
  formatShortDate,
  getLanguageDescriptor,
  translate,
  type TranslateOptions,
  type TranslationKey,
} from '@/i18n';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';

/**
 * Translation entry point for components.
 *
 * `t` is rebuilt whenever the language changes, so every screen re-renders with
 * the new copy without any component tracking the language itself.
 */
export function useTranslation() {
  const { language, direction, isRTL } = useLanguageDirection();

  return useMemo(
    () => ({
      language,
      direction,
      isRTL,
      locale: getLanguageDescriptor(language).locale,
      t: (key: TranslationKey, options?: TranslateOptions) =>
        translate(key, options),
      formatNumber: (value: number) => formatNumber(value, language),
      formatShortDate: (value: Date) => formatShortDate(value, language),
    }),
    [direction, isRTL, language],
  );
}
