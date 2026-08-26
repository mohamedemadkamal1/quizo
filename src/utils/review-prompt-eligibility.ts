/**
 * When the store rating prompt is allowed to interrupt a level celebration.
 *
 * Both stores throttle the native review sheet on their own side (iOS caps it
 * at three sheets per year), so these rules exist to make sure the few chances
 * we get are spent on players who are actually enjoying a streak of levels —
 * and never on a player who already said "maybe later" a minute ago.
 */
export const LEVELS_BEFORE_FIRST_PROMPT = 3;
export const LEVELS_BETWEEN_PROMPTS = 5;
export const DAYS_BETWEEN_PROMPTS = 14;
export const MAX_PROMPTS = 3;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type ReviewPromptSnapshot = {
  /** Levels the player has passed since the app was installed. */
  completedLevels: number;
  /** Levels the player had passed the last time the prompt was shown. */
  completedLevelsAtLastPrompt: number;
  /** How many times the prompt has been shown. */
  promptCount: number;
  lastPromptedAt: number | null;
  /** The player was already handed off to the store review flow. */
  hasOpenedReviewFlow: boolean;
};

export function shouldShowReviewPrompt(
  snapshot: ReviewPromptSnapshot,
  now: number,
): boolean {
  if (snapshot.hasOpenedReviewFlow || snapshot.promptCount >= MAX_PROMPTS) {
    return false;
  }

  if (snapshot.promptCount === 0) {
    return snapshot.completedLevels >= LEVELS_BEFORE_FIRST_PROMPT;
  }

  const levelsSinceLastPrompt =
    snapshot.completedLevels - snapshot.completedLevelsAtLastPrompt;

  if (levelsSinceLastPrompt < LEVELS_BETWEEN_PROMPTS) {
    return false;
  }

  // A missing timestamp means the counter was written by an older build, so
  // the level distance above is the only gate left to honour.
  if (snapshot.lastPromptedAt === null) {
    return true;
  }

  return now - snapshot.lastPromptedAt >= DAYS_BETWEEN_PROMPTS * DAY_IN_MS;
}
