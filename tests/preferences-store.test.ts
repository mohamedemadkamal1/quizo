import assert from 'node:assert/strict';
import test from 'node:test';

import { createPreferencesStore } from '../src/store/preferences-state.ts';

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    values,
    storage: {
      getItem: async (key: string) => values.get(key) ?? null,
      setItem: async (key: string, value: string) => {
        values.set(key, value);
      },
      removeItem: async (key: string) => {
        values.delete(key);
      },
    },
  };
}

test('app sound defaults to enabled', () => {
  const { storage } = createMemoryStorage();
  const store = createPreferencesStore(storage);

  assert.equal(store.getState().soundEnabled, true);
});

test('disabling app sound survives store rehydration', async () => {
  const { storage } = createMemoryStorage();
  const firstLaunch = createPreferencesStore(storage);

  firstLaunch.getState().setSoundEnabled(false);

  const nextLaunch = createPreferencesStore(storage);
  assert.equal(nextLaunch.getState().soundEnabled, true);

  await nextLaunch.persist.rehydrate();

  assert.equal(nextLaunch.getState().soundEnabled, false);
});

test('the previous narration preference migrates to the unified sound switch', async () => {
  const { storage, values } = createMemoryStorage();
  values.set(
    'quizo-preferences',
    JSON.stringify({ state: { readQuestionsAloud: false }, version: 0 }),
  );
  const store = createPreferencesStore(storage);

  await store.persist.rehydrate();

  assert.equal(store.getState().soundEnabled, false);
});
