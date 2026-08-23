import { useCallback, useMemo, useRef } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

import { useTranslation } from '@/hooks/useTranslation';
import { LANGUAGE_OPTIONS, type AppLanguage } from '@/i18n';
import { useLanguageStore } from '@/store/language.store';

export type LanguageChoice = {
  language: AppLanguage;
  /** `🇪🇬 AR` — the compact form used by the auth dropdown. */
  compactLabel: string;
  /** `🇪🇬 Egypt — العربية (AR)` — the form used by the native pickers. */
  detailedLabel: string;
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
        compactLabel: `${descriptor.flag} ${descriptor.shortCode}`,
        detailedLabel: `${descriptor.flag} ${t(descriptor.countryKey)} — ${descriptor.endonym} (${descriptor.shortCode})`,
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

  /**
   * Opens the platform's own selection UI: an action sheet on iOS and an alert
   * dialog on Android, rather than a Quizo-styled modal.
   */
  const presentLanguagePicker = useCallback(() => {
    const cancelLabel = t('common.cancel');

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t('language.sheetTitle'),
          message: t('language.sheetMessage'),
          options: [...choices.map((choice) => choice.detailedLabel), cancelLabel],
          cancelButtonIndex: choices.length,
          userInterfaceStyle: 'light',
        },
        (selectedIndex) => {
          const choice = choices[selectedIndex];

          if (choice) {
            void selectLanguage(choice.language);
          }
        },
      );

      return;
    }

    Alert.alert(
      t('language.sheetTitle'),
      t('language.sheetMessage'),
      [
        ...choices.map((choice) => ({
          text: choice.detailedLabel,
          onPress: () => {
            void selectLanguage(choice.language);
          },
        })),
        { text: cancelLabel, style: 'cancel' as const },
      ],
      { cancelable: true },
    );
  }, [choices, selectLanguage, t]);

  return {
    language,
    choices,
    selectLanguage,
    presentLanguagePicker,
  };
}
