import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  applyLanguage,
  DEFAULT_LANGUAGE,
  getDeviceLanguage,
  getDirection,
  type AppLanguage,
} from '@/i18n';
import { syncNativeDirection, type DirectionSyncResult } from '@/i18n/direction';
import {
  readLanguagePreference,
  resolveInitialLanguage,
  writeLanguagePreference,
  type LanguagePreferenceStorage,
  type PersistedLanguage,
} from '@/i18n/language-preference';
import { queryClient } from '@/services/api/query-client';
import { LANGUAGE_STORAGE_KEY } from '@/store/storage-keys';

/**
 * Stored separately from `quizo-auth-session` on purpose: signing out or
 * deleting the account clears that key and must never take the language with
 * it.
 */
type LanguageStore = {
  language: AppLanguage;
  /** True once the user has picked a language themselves. */
  hasExplicitSelection: boolean;
  isHydrated: boolean;
  setLanguage: (language: AppLanguage) => Promise<DirectionSyncResult>;
};

const languageStorage: LanguagePreferenceStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
};

async function readPersistedLanguage(): Promise<PersistedLanguage | null> {
  try {
    return await readLanguagePreference(languageStorage, LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

async function writePersistedLanguage(value: PersistedLanguage) {
  await writeLanguagePreference(languageStorage, LANGUAGE_STORAGE_KEY, value);
}

let languageChangePromise: Promise<DirectionSyncResult> | null = null;

export const useLanguageStore = create<LanguageStore>()((set, get) => ({
  language: DEFAULT_LANGUAGE,
  hasExplicitSelection: false,
  isHydrated: false,

  setLanguage: async (language) => {
    if (get().language === language) {
      // Re-picking the active language must not restart the app.
      return 'in-sync';
    }

    if (languageChangePromise) {
      return languageChangePromise;
    }

    languageChangePromise = (async () => {
      // Persisted first: a successful direction change restarts the process,
      // so the new value has to already be on disk by then.
      await writePersistedLanguage({ language, hasExplicitSelection: true });

      // Stop old-language requests before exposing the new language. Every
      // localized query key also carries the language, so mounted observers
      // immediately move to an empty key and refetch with the new `lng` header.
      await queryClient.cancelQueries();

      applyLanguage(language);
      set({ language, hasExplicitSelection: true });
      queryClient.removeQueries();

      return syncNativeDirection(getDirection(language));
    })();

    try {
      return await languageChangePromise;
    } finally {
      languageChangePromise = null;
    }
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
      const language = resolveInitialLanguage(persisted, getDeviceLanguage());

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
