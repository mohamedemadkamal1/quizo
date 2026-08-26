import assert from 'node:assert/strict';
import test from 'node:test';

import { createReviewPromptStore } from '../src/store/review-prompt-state.ts';

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

test('a fresh install has never been prompted', () => {
  const { storage } = createMemoryStorage();
  const store = createReviewPromptStore(storage).getState();

  assert.equal(store.completedLevels, 0);
  assert.equal(store.promptCount, 0);
  assert.equal(store.lastPromptedAt, null);
  assert.equal(store.hasOpenedReviewFlow, false);
  assert.equal(store.selectedStars, 0);
});

test('showing the card records when it happened and at which level', () => {
  const { storage } = createMemoryStorage();
  const store = createReviewPromptStore(storage);
  const shownAt = Date.UTC(2026, 0, 20);

  store.getState().registerLevelCompletion();
  store.getState().registerLevelCompletion();
  store.getState().registerPromptShown(shownAt);
  store.getState().registerLevelCompletion();

  assert.equal(store.getState().completedLevels, 3);
  assert.equal(store.getState().completedLevelsAtLastPrompt, 2);
  assert.equal(store.getState().promptCount, 1);
  assert.equal(store.getState().lastPromptedAt, shownAt);
});

test('the prompt history survives a relaunch', async () => {
  const { storage } = createMemoryStorage();
  const firstLaunch = createReviewPromptStore(storage);
  const shownAt = Date.UTC(2026, 0, 20);

  firstLaunch.getState().registerLevelCompletion();
  firstLaunch.getState().registerPromptShown(shownAt);
  firstLaunch.getState().selectStars(4);
  firstLaunch.getState().registerReviewFlowOpened();

  const nextLaunch = createReviewPromptStore(storage);
  await nextLaunch.persist.rehydrate();

  assert.equal(nextLaunch.getState().completedLevels, 1);
  assert.equal(nextLaunch.getState().promptCount, 1);
  assert.equal(nextLaunch.getState().lastPromptedAt, shownAt);
  assert.equal(nextLaunch.getState().hasOpenedReviewFlow, true);
  assert.equal(nextLaunch.getState().selectedStars, 4);
});

test('a corrupted counter falls back to a fresh history', async () => {
  const { storage, values } = createMemoryStorage();
  values.set(
    'quizo-review-prompt',
    JSON.stringify({
      state: {
        completedLevels: 'many',
        promptCount: -3,
        lastPromptedAt: 'yesterday',
        hasOpenedReviewFlow: 'yes',
        selectedStars: 99,
      },
      version: 0,
    }),
  );
  const store = createReviewPromptStore(storage);

  await store.persist.rehydrate();

  assert.equal(store.getState().completedLevels, 0);
  assert.equal(store.getState().promptCount, 0);
  assert.equal(store.getState().lastPromptedAt, null);
  assert.equal(store.getState().hasOpenedReviewFlow, false);
  assert.equal(store.getState().selectedStars, 5);
});

test('a star selection stays inside the five-star scale', () => {
  const { storage } = createMemoryStorage();
  const store = createReviewPromptStore(storage);

  store.getState().selectStars(9);
  assert.equal(store.getState().selectedStars, 5);

  store.getState().selectStars(-2);
  assert.equal(store.getState().selectedStars, 0);
});
