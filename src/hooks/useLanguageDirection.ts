import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { getDirection, type AppLanguage, type TextDirection } from '@/i18n';
import { useLanguageStore } from '@/store/language.store';

export type LanguageDirection = {
  language: AppLanguage;
  direction: TextDirection;
  isRTL: boolean;
  /**
   * Applied to the root of any tree React Native renders outside the app root
   * — every `Modal` starts its own native root and would otherwise fall back
   * to the platform direction.
   */
  directionStyle: ViewStyle;
};

/**
 * The single place a component asks "which way does the interface run?".
 *
 * Keeping the resolution here means no screen re-derives direction from the
 * language, and every consumer re-renders together when the language changes.
 */
export function useLanguageDirection(): LanguageDirection {
  const language = useLanguageStore((state) => state.language);

  return useMemo(() => {
    const direction = getDirection(language);

    return {
      language,
      direction,
      isRTL: direction === 'rtl',
      directionStyle: { direction },
    };
  }, [language]);
}
