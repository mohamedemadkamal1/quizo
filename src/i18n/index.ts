import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import { ar } from '@/i18n/locales/ar';
import { en } from '@/i18n/locales/en';
import {
  APP_LANGUAGES,
  type AppLanguage,
  type LanguageDescriptor,
  type TextDirection,
  type TranslationKey,
} from '@/i18n/types';

export type { AppLanguage, TextDirection, TranslationKey } from '@/i18n/types';
export { APP_LANGUAGES } from '@/i18n/types';

/** Values allowed in an interpolation, so no `any` reaches `i18n.t`. */
export type TranslateValues = Readonly<Record<string, string | number>>;

export type TranslateOptions = TranslateValues & {
  /** Selects the plural form for keys that declare CLDR plural categories. */
  readonly count?: number;
};

/**
 * The translator signature passed to non-component code such as the Zod schema
 * factories, so validation copy follows the active language.
 */
export type Translate = (
  key: TranslationKey,
  options?: TranslateOptions,
) => string;

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export const LANGUAGE_DESCRIPTORS: Readonly<
  Record<AppLanguage, LanguageDescriptor>
> = {
  en: {
    language: 'en',
    locale: 'en-US',
    direction: 'ltr',
    flag: '\u{1F1FA}\u{1F1F8}',
    shortCode: 'EN',
    countryKey: 'language.unitedStates',
    nameKey: 'language.english',
    endonym: 'English',
  },
  ar: {
    language: 'ar',
    locale: 'ar-EG',
    direction: 'rtl',
    flag: '\u{1F1EA}\u{1F1EC}',
    shortCode: 'AR',
    countryKey: 'language.egypt',
    nameKey: 'language.arabic',
    endonym: 'العربية',
  },
};

export const LANGUAGE_OPTIONS: readonly LanguageDescriptor[] = [
  LANGUAGE_DESCRIPTORS.ar,
  LANGUAGE_DESCRIPTORS.en,
];

const i18n = new I18n(
  { en, ar },
  {
    defaultLocale: DEFAULT_LANGUAGE,
    locale: DEFAULT_LANGUAGE,
    enableFallback: true,
  },
);

/**
 * CLDR cardinal categories for Arabic. Written out rather than taken from
 * `Intl.PluralRules` so the plural form never depends on the ICU data that a
 * given JavaScript engine happens to ship.
 */
i18n.pluralization.register('ar', (_i18n, count) => {
  const absolute = Math.abs(count);
  const remainder = absolute % 100;

  if (absolute === 0) {
    return ['zero', 'other'];
  }

  if (absolute === 1) {
    return ['one', 'other'];
  }

  if (absolute === 2) {
    return ['two', 'other'];
  }

  if (remainder >= 3 && remainder <= 10) {
    return ['few', 'other'];
  }

  if (remainder >= 11 && remainder <= 99) {
    return ['many', 'other'];
  }

  return ['other'];
});

let currentLanguage: AppLanguage = DEFAULT_LANGUAGE;

export function isAppLanguage(value: unknown): value is AppLanguage {
  return APP_LANGUAGES.some((language) => language === value);
}

export function getCurrentLanguage(): AppLanguage {
  return currentLanguage;
}

export function getLanguageDescriptor(
  language: AppLanguage = currentLanguage,
): LanguageDescriptor {
  return LANGUAGE_DESCRIPTORS[language];
}

export function getDirection(
  language: AppLanguage = currentLanguage,
): TextDirection {
  return LANGUAGE_DESCRIPTORS[language].direction;
}

export function isRtl(language: AppLanguage = currentLanguage): boolean {
  return getDirection(language) === 'rtl';
}

/**
 * The language a fresh installation starts with: Arabic when the device's
 * primary language is Arabic, English otherwise. A stored selection always
 * wins over this, which the language store enforces.
 */
export function getDeviceLanguage(): AppLanguage {
  const primaryLocale = getLocales()[0];

  return primaryLocale.languageCode === 'ar' ? 'ar' : DEFAULT_LANGUAGE;
}

/** Points the translator at `language`. Persistence is the store's job. */
export function applyLanguage(language: AppLanguage) {
  currentLanguage = language;
  i18n.locale = language;
}

export function translate(
  key: TranslationKey,
  options?: TranslateOptions,
): string {
  return i18n.t(key, options);
}

/**
 * Component translations are resolved from the same Zustand language value
 * that drives direction and selector state. Passing the locale explicitly
 * makes the view immune to a stale mutable i18n singleton during reloads and
 * Fast Refresh.
 */
export function translateForLanguage(
  language: AppLanguage,
  key: TranslationKey,
  options?: TranslateOptions,
): string {
  return i18n.t(key, { ...options, locale: language });
}

function formatWithIntl(
  format: () => string,
  fallback: () => string,
): string {
  try {
    return format();
  } catch {
    // Hermes builds without full ICU data fall back to an unformatted value
    // rather than crashing a screen.
    return fallback();
  }
}

/** Locale-aware number for user-visible totals (`en-US` / `ar-EG`). */
export function formatNumber(
  value: number,
  language: AppLanguage = currentLanguage,
): string {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;

  return formatWithIntl(
    () =>
      new Intl.NumberFormat(LANGUAGE_DESCRIPTORS[language].locale).format(
        safeValue,
      ),
    () => String(safeValue),
  );
}

/** Short locale-aware date, used for "last played" style labels. */
export function formatShortDate(
  date: Date,
  language: AppLanguage = currentLanguage,
): string {
  return formatWithIntl(
    () =>
      new Intl.DateTimeFormat(LANGUAGE_DESCRIPTORS[language].locale, {
        month: 'short',
        day: 'numeric',
      }).format(date),
    () => date.toDateString(),
  );
}
