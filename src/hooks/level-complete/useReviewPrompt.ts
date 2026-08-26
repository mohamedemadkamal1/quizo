import { useCallback, useEffect, useRef, useState } from 'react';

import {
  isStoreReviewSupported,
  openStoreReview,
} from '@/services/store-review.service';
import {
  registerLevelCompletion,
  registerPromptShown,
  registerReviewFlowOpened,
  useReviewPromptStore,
} from '@/store/review-prompt.store';
import { shouldShowReviewPrompt } from '@/utils/review-prompt-eligibility';

/** Lets the celebration land before anything is asked of the player. */
const PROMPT_DELAY_MS = 1200;
/**
 * The native review sheet cannot present itself on top of a React Native
 * modal, so the card is dismissed and given time to fade out before the store
 * flow is requested.
 */
const STORE_HANDOFF_DELAY_MS = 320;

export type ReviewPromptController = {
  isVisible: boolean;
  isOpeningStore: boolean;
  selectedStars: number;
  selectStars: (stars: number) => void;
  openReview: () => void;
  dismiss: () => void;
};

/**
 * Counts the finished level and, when the player has earned enough of them,
 * offers the store rating card once the result screen has settled.
 */
export function useReviewPrompt(
  sessionId: number | null,
): ReviewPromptController {
  const selectedStars = useReviewPromptStore((state) => state.selectedStars);
  const selectStars = useReviewPromptStore((state) => state.selectStars);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpeningStore, setIsOpeningStore] = useState(false);
  const countedSessionRef = useRef<number | null>(null);
  const handoffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionId === null || countedSessionRef.current === sessionId) {
      return;
    }

    countedSessionRef.current = sessionId;

    const snapshot = registerLevelCompletion();

    if (!shouldShowReviewPrompt(snapshot, Date.now())) {
      return;
    }

    let isActive = true;
    let promptTimer: ReturnType<typeof setTimeout> | null = null;

    void isStoreReviewSupported().then((isSupported) => {
      if (!isActive || !isSupported) {
        return;
      }

      promptTimer = setTimeout(() => {
        if (!isActive) {
          return;
        }

        // Counted at display time so a player who never saw the card — because
        // the screen was left first — is not charged one of their few asks.
        registerPromptShown(Date.now());
        setIsVisible(true);
      }, PROMPT_DELAY_MS);
    });

    return () => {
      isActive = false;

      if (promptTimer) {
        clearTimeout(promptTimer);
      }
    };
  }, [sessionId]);

  useEffect(
    () => () => {
      if (handoffTimerRef.current) {
        clearTimeout(handoffTimerRef.current);
      }
    },
    [],
  );

  const dismiss = useCallback(() => {
    if (!isOpeningStore) {
      setIsVisible(false);
    }
  }, [isOpeningStore]);

  const openReview = useCallback(() => {
    if (isOpeningStore) {
      return;
    }

    setIsOpeningStore(true);
    registerReviewFlowOpened();
    setIsVisible(false);

    handoffTimerRef.current = setTimeout(() => {
      void openStoreReview().finally(() => setIsOpeningStore(false));
    }, STORE_HANDOFF_DELAY_MS);
  }, [isOpeningStore]);

  return {
    isVisible,
    isOpeningStore,
    selectedStars,
    selectStars,
    openReview,
    dismiss,
  };
}
