import type { AppLanguage } from './types';

export type PersistedLanguage = {
  language: AppLanguage;
  hasExplicitSelection: boolean;
};

export type LanguagePreferenceStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function parsePersistedLanguage(
  value: string | null,
): PersistedLanguage | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;

    if (record.language !== 'en' && record.language !== 'ar') {
      return null;
    }

    return {
      language: record.language,
      hasExplicitSelection: record.hasExplicitSelection === true,
    };
  } catch {
    return null;
  }
}

export function resolveInitialLanguage(
  persisted: PersistedLanguage | null,
  deviceLanguage: AppLanguage,
): AppLanguage {
  return persisted?.language ?? deviceLanguage;
}

export async function readLanguagePreference(
  storage: LanguagePreferenceStorage,
  storageKey: string,
): Promise<PersistedLanguage | null> {
  return parsePersistedLanguage(await storage.getItem(storageKey));
}

export async function writeLanguagePreference(
  storage: LanguagePreferenceStorage,
  storageKey: string,
  value: PersistedLanguage,
): Promise<void> {
  await storage.setItem(storageKey, JSON.stringify(value));
}
