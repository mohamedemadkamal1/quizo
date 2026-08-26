import { createStore } from 'zustand/vanilla';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import type { ReviewPromptSnapshot } from '@/utils/review-prompt-eligibility';

import { REVIEW_PROMPT_STORAGE_KEY } from './storage-keys.ts';

export type ReviewPromptStoreState = ReviewPromptSnapshot & {
  /**
   * The last star count the player tapped in our own card. The stores never
   * accept a rating from an API, so this is kept only to restore the card in
   * the state the player left it and is never used to decide who gets asked.
   */
  selectedStars: number;
  registerLevelCompletion: () => void;
  registerPromptShown: (shownAt: number) => void;
  registerReviewFlowOpened: () => void;
  selectStars: (stars: number) => void;
};

const MAX_STARS = 5;

function readCount(value: unknown): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? value
    : 0;
}

export function createReviewPromptStore(storage: StateStorage) {
  return createStore<ReviewPromptStoreState>()(
    persist(
      (set) => ({
        completedLevels: 0,
        completedLevelsAtLastPrompt: 0,
        promptCount: 0,
        lastPromptedAt: null,
        hasOpenedReviewFlow: false,
        selectedStars: 0,
        registerLevelCompletion: () => {
          set((state) => ({ completedLevels: state.completedLevels + 1 }));
        },
        registerPromptShown: (shownAt) => {
          set((state) => ({
            promptCount: state.promptCount + 1,
            completedLevelsAtLastPrompt: state.completedLevels,
            lastPromptedAt: shownAt,
          }));
        },
        registerReviewFlowOpened: () => {
          set({ hasOpenedReviewFlow: true });
        },
        selectStars: (stars) => {
          set({
            selectedStars: Math.min(Math.max(Math.round(stars), 0), MAX_STARS),
          });
        },
      }),
      {
        name: REVIEW_PROMPT_STORAGE_KEY,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          completedLevels: state.completedLevels,
          completedLevelsAtLastPrompt: state.completedLevelsAtLastPrompt,
          promptCount: state.promptCount,
          lastPromptedAt: state.lastPromptedAt,
          hasOpenedReviewFlow: state.hasOpenedReviewFlow,
          selectedStars: state.selectedStars,
        }),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          const persisted = (persistedState ?? {}) as Partial<
            Record<keyof ReviewPromptStoreState, unknown>
          >;
          const lastPromptedAt = persisted.lastPromptedAt;

          return {
            ...currentState,
            completedLevels: readCount(persisted.completedLevels),
            completedLevelsAtLastPrompt: readCount(
              persisted.completedLevelsAtLastPrompt,
            ),
            promptCount: readCount(persisted.promptCount),
            lastPromptedAt:
              typeof lastPromptedAt === 'number' &&
              Number.isFinite(lastPromptedAt)
                ? lastPromptedAt
                : null,
            hasOpenedReviewFlow: persisted.hasOpenedReviewFlow === true,
            selectedStars: Math.min(
              readCount(persisted.selectedStars),
              MAX_STARS,
            ),
          };
        },
      },
    ),
  );
}
