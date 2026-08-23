import { StyleSheet, type TextStyle } from 'react-native';

import type { AppLanguage } from '@/i18n';

/**
 * Fredoka and Nunito carry no Arabic glyphs, so Arabic runs on Cairo — a
 * rounded, highly legible Arabic family that sits well next to the existing
 * English type.
 *
 * The swap lives here and is applied once, inside `AppText` / `AppTextInput`,
 * rather than being re-decided in every component.
 */
export const ARABIC_FONT_FAMILY = 'Cairo';

const styles = StyleSheet.create({
  arabic: {
    fontFamily: ARABIC_FONT_FAMILY,
    writingDirection: 'rtl',
  },

  arabicDirectionalText: {
    // React Native Android treats left/right text alignment as logical when
    // the Text node itself has RTL layout direction, which turns `right` into
    // the physical left edge. Keep layout direction neutral here so the
    // explicit alignment stays physical; `writingDirection` still controls
    // the bidi flow of the text itself.
    direction: 'ltr',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  englishDirectionalText: {
    direction: 'ltr',
    textAlign: 'left',
    writingDirection: 'ltr',
  },

  /**
   * Content that stays Latin and left-to-right whatever the interface
   * language: email addresses, passwords, OTP codes, URLs and identifiers.
   */
  ltrContent: {
    writingDirection: 'ltr',
    textAlign: 'left',
  },
});

export function getLanguageTextStyle(language: AppLanguage): TextStyle | null {
  return language === 'ar' ? styles.arabic : null;
}

/**
 * Explicit alignment for dynamic prose whose characters may not match the
 * active interface language (for example, backend-provided quiz content).
 * Centered headings opt out by simply not requesting this style.
 */
export function getLanguageDirectionalTextStyle(
  language: AppLanguage,
): TextStyle {
  return language === 'ar'
    ? styles.arabicDirectionalText
    : styles.englishDirectionalText;
}

export const ltrContentTextStyle: TextStyle = styles.ltrContent;
