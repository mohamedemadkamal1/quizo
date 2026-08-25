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

test('question narration defaults to disabled', () => {
  const { storage } = createMemoryStorage();
  const store = createPreferencesStore(storage);

  assert.equal(store.getState().readQuestionsAloud, false);
});

test('enabling question narration survives store rehydration', async () => {
  const { storage } = createMemoryStorage();
  const firstLaunch = createPreferencesStore(storage);

  firstLaunch.getState().setReadQuestionsAloud(true);

  const nextLaunch = createPreferencesStore(storage);
  assert.equal(nextLaunch.getState().readQuestionsAloud, false);

  await nextLaunch.persist.rehydrate();

  assert.equal(nextLaunch.getState().readQuestionsAloud, true);
});
