import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  applyLanguage,
  DEFAULT_LANGUAGE,
  getDeviceLanguage,
  getDirection,
  isAppLanguage,
  type AppLanguage,
} from '@/i18n';
import { syncNativeDirection, type DirectionSyncResult } from '@/i18n/direction';
import { queryClient } from '@/services/api/query-client';

/**
 * Stored separately from `quizo-auth-session` on purpose: signing out or
 * deleting the account clears that key and must never take the language with
 * it.
 */
const LANGUAGE_STORAGE_KEY = 'quizo-language';

type LanguageStore = {
  language: AppLanguage;
  /** True once the user has picked a language themselves. */
  hasExplicitSelection: boolean;
  isHydrated: boolean;
  setLanguage: (language: AppLanguage) => Promise<DirectionSyncResult>;
};

type PersistedLanguage = {
  language: AppLanguage;
  hasExplicitSelection: boolean;
};

function parsePersistedLanguage(value: string | null): PersistedLanguage | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const record: Record<string, unknown> = { ...parsed };

    return isAppLanguage(record.language)
      ? {
          language: record.language,
          hasExplicitSelection: record.hasExplicitSelection === true,
        }
      : null;
  } catch {
    return null;
  }
}

async function readPersistedLanguage(): Promise<PersistedLanguage | null> {
  try {
    return parsePersistedLanguage(
      await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

async function writePersistedLanguage(value: PersistedLanguage) {
  await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, JSON.stringify(value));
}

export const useLanguageStore = create<LanguageStore>()((set, get) => ({
  language: DEFAULT_LANGUAGE,
  hasExplicitSelection: false,
  isHydrated: false,

  setLanguage: async (language) => {
    if (get().language === language) {
      // Re-picking the active language must not restart the app.
      return 'in-sync';
    }

    // Persisted first: a successful direction change restarts the process, so
    // the new value has to already be on disk by then.
    await writePersistedLanguage({ language, hasExplicitSelection: true });

    applyLanguage(language);
    set({ language, hasExplicitSelection: true });

    // Backend copy (categories, questions) is language-specific, so everything
    // fetched under the previous `lng` header is dropped and refetched under
    // the new one. The auth session lives in SecureStore and is untouched.
    await queryClient.cancelQueries();
    queryClient.clear();

    return syncNativeDirection(getDirection(language));
  },
}));

let hydrationPromise: Promise<void> | null = null;

/**
 * Restores the stored language, falling back to the device language on a fresh
 * installation, and brings the native layout direction in line with it.
 *
 * Safe to call repeatedly: the work happens once per app launch.
 */
export function hydrateLanguage(): Promise<void> {
  if (!hydrationPromise) {
    hydrationPromise = (async () => {
      const persisted = await readPersistedLanguage();
      const language = persisted?.language ?? getDeviceLanguage();

      applyLanguage(language);
      useLanguageStore.setState({
        language,
        hasExplicitSelection: persisted?.hasExplicitSelection ?? false,
        isHydrated: true,
      });

      if (!persisted) {
        // Remember the device-derived choice so a later OS language change
        // cannot silently move an existing installation.
        await writePersistedLanguage({
          language,
          hasExplicitSelection: false,
        });
      }

      await syncNativeDirection(getDirection(language));
    })();
  }

  return hydrationPromise;
}

/** Reads the active language without React, for the Axios interceptor. */
export function getStoredLanguage(): AppLanguage {
  return useLanguageStore.getState().language;
}
