import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  applyLanguage,
  DEFAULT_LANGUAGE,
  getDeviceLanguage,
  getDirection,
  type AppLanguage,
} from '@/i18n';
import {
  configureNativeDirection,
  getNativeDirection,
  reloadLanguageApplication,
} from '@/i18n/direction';
import {
  createLanguageSwitcher,
  parseLanguageRestartMarker,
  reconcileStartupDirection,
  type LanguageRestartError,
  type LanguageRestartMarker,
  type LanguageSwitchResult,
} from '@/i18n/language-switch';
import {
  readLanguagePreference,
  resolveInitialLanguage,
  writeLanguagePreference,
  type LanguagePreferenceStorage,
  type PersistedLanguage,
} from '@/i18n/language-preference';
import { waitForRestartOverlayPaint } from '@/i18n/restart-overlay-paint';
import { markLocalizedQueriesStale } from '@/services/api/query-client';
import {
  LANGUAGE_RESTART_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
} from '@/store/storage-keys';

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
  /** True only in the runtime created by a language-direction reload. */
  didStartFromLanguageReload: boolean;
  isRestarting: boolean;
  restartTargetLanguage: AppLanguage | null;
  restartError: LanguageRestartError | null;
  dismissRestartError: () => void;
  setLanguage: (language: AppLanguage) => Promise<LanguageSwitchResult>;
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

async function readRestartMarker(): Promise<LanguageRestartMarker | null> {
  return parseLanguageRestartMarker(
    await SecureStore.getItemAsync(LANGUAGE_RESTART_STORAGE_KEY),
  );
}

async function writeRestartMarker(marker: LanguageRestartMarker): Promise<void> {
  await SecureStore.setItemAsync(
    LANGUAGE_RESTART_STORAGE_KEY,
    JSON.stringify(marker),
  );
}

async function clearRestartMarker(): Promise<void> {
  await SecureStore.deleteItemAsync(LANGUAGE_RESTART_STORAGE_KEY);
}

function reportLanguageError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[language] Restart operation failed: ${message}`);
}

export const useLanguageStore = create<LanguageStore>()((set) => ({
  language: DEFAULT_LANGUAGE,
  hasExplicitSelection: false,
  isHydrated: false,
  didStartFromLanguageReload: false,
  isRestarting: false,
  restartTargetLanguage: null,
  restartError: null,

  dismissRestartError: () => {
    set({ restartError: null, restartTargetLanguage: null });
  },

  setLanguage: async (language) => {
    return getLanguageSwitcher()(language);
  },
}));

let languageSwitcher: ReturnType<typeof createLanguageSwitcher> | null = null;

function getLanguageSwitcher() {
  if (!languageSwitcher) {
    languageSwitcher = createLanguageSwitcher({
      getActiveLanguage: () => useLanguageStore.getState().language,
      getNativeDirection,
      getDirection,
      setRestartUi: ({ isRestarting, targetLanguage, error }) => {
        useLanguageStore.setState({
          isRestarting,
          restartTargetLanguage: targetLanguage,
          restartError: error,
        });
      },
      persistLanguage: async (language) => {
        await writePersistedLanguage({
          language,
          hasExplicitSelection: true,
        });
      },
      applyLanguage: (language) => {
        applyLanguage(language);
        useLanguageStore.setState({
          language,
          hasExplicitSelection: true,
        });
      },
      invalidateLocalizedQueries: () => {
        void markLocalizedQueriesStale().catch(reportLanguageError);
      },
      writeRestartMarker,
      waitForRestartOverlayPaint,
      configureNativeDirection,
      reloadApp: reloadLanguageApplication,
      reportError: reportLanguageError,
    });
  }

  return languageSwitcher;
}

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
      const [persisted, restartMarker] = await Promise.all([
        readPersistedLanguage(),
        readRestartMarker(),
      ]);
      const language = resolveInitialLanguage(persisted, getDeviceLanguage());

      applyLanguage(language);
      useLanguageStore.setState({
        language,
        hasExplicitSelection: persisted?.hasExplicitSelection ?? false,
      });

      if (!persisted) {
        // Remember the device-derived choice so a later OS language change
        // cannot silently move an existing installation.
        await writePersistedLanguage({
          language,
          hasExplicitSelection: false,
        });
      }

      const directionResult = await reconcileStartupDirection(
        language,
        getDirection(language),
        {
          getNativeDirection,
          readRestartMarker: async () => restartMarker,
          writeRestartMarker,
          clearRestartMarker,
          configureNativeDirection,
          reloadApp: reloadLanguageApplication,
          reportError: reportLanguageError,
        },
      );

      useLanguageStore.setState({
        isHydrated: true,
        didStartFromLanguageReload: restartMarker !== null,
        isRestarting: false,
        restartTargetLanguage:
          directionResult === 'recovery-reload-failed'
            ? language
            : null,
        restartError:
          directionResult === 'recovery-reload-failed'
            ? 'language-direction-mismatch'
            : null,
      });
    })().catch((error) => {
      hydrationPromise = null;
      throw error;
    });
  }

  return hydrationPromise;
}

/** Reads the active language without React, for the Axios interceptor. */
export function getStoredLanguage(): AppLanguage {
  return useLanguageStore.getState().language;
}
