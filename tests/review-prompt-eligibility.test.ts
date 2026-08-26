import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DAYS_BETWEEN_PROMPTS,
  LEVELS_BEFORE_FIRST_PROMPT,
  LEVELS_BETWEEN_PROMPTS,
  MAX_PROMPTS,
  shouldShowReviewPrompt,
  type ReviewPromptSnapshot,
} from '../src/utils/review-prompt-eligibility.ts';

const NOW = Date.UTC(2026, 0, 20);
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function snapshot(
  overrides: Partial<ReviewPromptSnapshot> = {},
): ReviewPromptSnapshot {
  return {
    completedLevels: 0,
    completedLevelsAtLastPrompt: 0,
    promptCount: 0,
    lastPromptedAt: null,
    hasOpenedReviewFlow: false,
    ...overrides,
  };
}

test('the first levels are played without any interruption', () => {
  assert.equal(
    shouldShowReviewPrompt(
      snapshot({ completedLevels: LEVELS_BEFORE_FIRST_PROMPT - 1 }),
      NOW,
    ),
    false,
  );
});

test('the card is offered once enough levels have been passed', () => {
  assert.equal(
    shouldShowReviewPrompt(
      snapshot({ completedLevels: LEVELS_BEFORE_FIRST_PROMPT }),
      NOW,
    ),
    true,
  );
});

test('a player who reached the store is never asked again', () => {
  assert.equal(
    shouldShowReviewPrompt(
      snapshot({ completedLevels: 40, hasOpenedReviewFlow: true }),
      NOW,
    ),
    false,
  );
});

test('asking stops for good after the last allowed prompt', () => {
  assert.equal(
    shouldShowReviewPrompt(
      snapshot({
        completedLevels: 90,
        completedLevelsAtLastPrompt: 10,
        promptCount: MAX_PROMPTS,
        lastPromptedAt: NOW - 365 * DAY_IN_MS,
      }),
      NOW,
    ),
    false,
  );
});

test('a dismissal is followed by both a level and a time gap', () => {
  const dismissed = snapshot({
    completedLevelsAtLastPrompt: 10,
    promptCount: 1,
    lastPromptedAt: NOW - DAYS_BETWEEN_PROMPTS * DAY_IN_MS,
  });

  assert.equal(
    shouldShowReviewPrompt(
      { ...dismissed, completedLevels: 10 + LEVELS_BETWEEN_PROMPTS - 1 },
      NOW,
    ),
    false,
  );
  assert.equal(
    shouldShowReviewPrompt(
      { ...dismissed, completedLevels: 10 + LEVELS_BETWEEN_PROMPTS },
      NOW,
    ),
    true,
  );
});

test('enough levels alone cannot bring the card back the same week', () => {
  assert.equal(
    shouldShowReviewPrompt(
      snapshot({
        completedLevels: 60,
        completedLevelsAtLastPrompt: 10,
        promptCount: 1,
        lastPromptedAt: NOW - DAY_IN_MS,
      }),
      NOW,
    ),
    false,
  );
});
