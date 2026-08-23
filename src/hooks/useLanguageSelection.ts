import { useCallback, useMemo, useRef } from 'react';

import { useTranslation } from '@/hooks/useTranslation';
import { LANGUAGE_OPTIONS, type AppLanguage } from '@/i18n';
import { useLanguageStore } from '@/store/language.store';

export type LanguageChoice = {
  language: AppLanguage;
  flag: string;
  shortCode: string;
  compactLabel: string;
  /** Localized full name used by the Profile dropdown. */
  fullLabel: string;
  isSelected: boolean;
};

/**
 * Everything a language control needs, so the auth dropdown and the profile
 * row share one implementation of "switch the app's language" instead of each
 * screen growing its own.
 */
export function useLanguageSelection() {
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const isChangingRef = useRef(false);

  const choices = useMemo<LanguageChoice[]>(
    () =>
      LANGUAGE_OPTIONS.map((descriptor) => ({
        language: descriptor.language,
        flag: descriptor.flag,
        shortCode: descriptor.shortCode,
        compactLabel: `${descriptor.flag} ${descriptor.shortCode}`,
        fullLabel: t(descriptor.nameKey),
        isSelected: descriptor.language === language,
      })),
    [language, t],
  );

  const selectLanguage = useCallback(
    async (nextLanguage: AppLanguage) => {
      // Picking the language that is already active is a no-op, so the app
      // never restarts just to arrive where it already was.
      if (isChangingRef.current || nextLanguage === language) {
        return;
      }

      isChangingRef.current = true;

      try {
        await setLanguage(nextLanguage);
      } finally {
        isChangingRef.current = false;
      }
    },
    [language, setLanguage],
  );

  return {
    language,
    choices,
    selectLanguage,
  };
}
