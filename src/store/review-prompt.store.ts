import * as SecureStore from 'expo-secure-store';
import { useStore } from 'zustand';
import type { StateStorage } from 'zustand/middleware';

import {
  createReviewPromptStore,
  type ReviewPromptStoreState,
} from '@/store/review-prompt-state';
import type { ReviewPromptSnapshot } from '@/utils/review-prompt-eligibility';

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

const reviewPromptStore = createReviewPromptStore(secureStorage);

export function useReviewPromptStore<T>(
  selector: (state: ReviewPromptStoreState) => T,
): T {
  return useStore(reviewPromptStore, selector);
}

/**
 * Counts one passed level and hands back the snapshot the eligibility rules
 * read, so the caller never has to re-read the store after writing to it.
 */
export function registerLevelCompletion(): ReviewPromptSnapshot {
  reviewPromptStore.getState().registerLevelCompletion();

  const {
    completedLevels,
    completedLevelsAtLastPrompt,
    promptCount,
    lastPromptedAt,
    hasOpenedReviewFlow,
  } = reviewPromptStore.getState();

  return {
    completedLevels,
    completedLevelsAtLastPrompt,
    promptCount,
    lastPromptedAt,
    hasOpenedReviewFlow,
  };
}

export function registerPromptShown(shownAt: number): void {
  reviewPromptStore.getState().registerPromptShown(shownAt);
}

export function registerReviewFlowOpened(): void {
  reviewPromptStore.getState().registerReviewFlowOpened();
}

let hydrationPromise: Promise<void> | null = null;

export function hydrateReviewPrompt(): Promise<void> {
  if (!hydrationPromise) {
    hydrationPromise = Promise.resolve(
      reviewPromptStore.persist.rehydrate(),
    ).catch((error) => {
      hydrationPromise = null;
      throw error;
    });
  }

  return hydrationPromise;
}
