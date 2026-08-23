import assert from 'node:assert/strict';
import test from 'node:test';

import {
  readLanguagePreference,
  resolveInitialLanguage,
  writeLanguagePreference,
  type LanguagePreferenceStorage,
} from '../src/i18n/language-preference.ts';
import {
  AUTH_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
} from '../src/store/storage-keys.ts';

function createMemoryStorage() {
  const values = new Map<string, string>();
  const storage: LanguagePreferenceStorage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  return { storage, values };
}

test('a fresh launch uses Arabic only for an Arabic device language', () => {
  assert.equal(resolveInitialLanguage(null, 'ar'), 'ar');
  assert.equal(resolveInitialLanguage(null, 'en'), 'en');
});

test('a persisted choice overrides the device language', () => {
  assert.equal(
    resolveInitialLanguage(
      { language: 'en', hasExplicitSelection: true },
      'ar',
    ),
    'en',
  );
  assert.equal(
    resolveInitialLanguage(
      { language: 'ar', hasExplicitSelection: true },
      'en',
    ),
    'ar',
  );
});

test('English to Arabic and Arabic to English persist independently', async () => {
  const { storage } = createMemoryStorage();

  await writeLanguagePreference(storage, LANGUAGE_STORAGE_KEY, {
    language: 'ar',
    hasExplicitSelection: true,
  });
  assert.deepEqual(await readLanguagePreference(storage, LANGUAGE_STORAGE_KEY), {
    language: 'ar',
    hasExplicitSelection: true,
  });

  await writeLanguagePreference(storage, LANGUAGE_STORAGE_KEY, {
    language: 'en',
    hasExplicitSelection: true,
  });
  assert.deepEqual(await readLanguagePreference(storage, LANGUAGE_STORAGE_KEY), {
    language: 'en',
    hasExplicitSelection: true,
  });
});

test('clearing authentication does not clear the language preference', async () => {
  const { storage, values } = createMemoryStorage();
  values.set(AUTH_STORAGE_KEY, 'session');
  await writeLanguagePreference(storage, LANGUAGE_STORAGE_KEY, {
    language: 'ar',
    hasExplicitSelection: true,
  });

  values.delete(AUTH_STORAGE_KEY);

  assert.deepEqual(await readLanguagePreference(storage, LANGUAGE_STORAGE_KEY), {
    language: 'ar',
    hasExplicitSelection: true,
  });
});
