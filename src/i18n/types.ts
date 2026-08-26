import type { en } from '@/i18n/locales/en';

export const APP_LANGUAGES = ['en', 'ar'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export type TextDirection = 'ltr' | 'rtl';

/**
 * CLDR plural categories. `other` is always required so every count has a
 * rendering, while the remaining categories are supplied per language: English
 * only needs `zero`/`one`, Arabic additionally uses `two`, `few` and `many`.
 */
export type PluralForms = {
  readonly zero: string;
  readonly one: string;
  readonly two: string;
  readonly few: string;
  readonly many: string;
  readonly other: string;
};

/**
 * Replaces the literal string types inferred from the English dictionary with
 * `string`, so a locale must repeat the exact same key structure without being
 * forced to repeat the same English wording.
 */
type Widen<T> = T extends string
  ? string
  : T extends PluralForms
    ? PluralForms
    : { [K in keyof T]: Widen<T[K]> };

/** The shape every locale dictionary has to implement. */
export type TranslationSchema = Widen<typeof en>;

type LeafPaths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string
        ? K
        : T[K] extends PluralForms
          ? K
          : `${K}.${LeafPaths<T[K]>}`;
    }[keyof T & string];

/** Every dotted key that resolves to a translatable value. */
export type TranslationKey = LeafPaths<TranslationSchema>;

export type LanguageDescriptor = {
  readonly language: AppLanguage;
  /** BCP 47 tag used for `Intl` number and date formatting. */
  readonly locale: string;
  readonly direction: TextDirection;
  readonly flag: string;
  /** Compact code shown in the auth dropdown, e.g. `AR`. */
  readonly shortCode: string;
  readonly countryKey: TranslationKey;
  readonly nameKey: TranslationKey;
  /** The language's own name, always rendered in that language. */
  readonly endonym: string;
};
