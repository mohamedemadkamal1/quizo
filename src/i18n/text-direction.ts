import type { AppLanguage } from './types';

export type DirectionalTextValues = {
  direction: 'ltr';
  textAlign: 'left' | 'right';
  writingDirection: 'ltr' | 'rtl';
};

/** Physical alignment plus bidi flow for natural-language content. */
export function getDirectionalTextValues(
  language: AppLanguage,
): DirectionalTextValues {
  return language === 'ar'
    ? {
        direction: 'ltr',
        textAlign: 'right',
        writingDirection: 'rtl',
      }
    : {
        direction: 'ltr',
        textAlign: 'left',
        writingDirection: 'ltr',
      };
}

