import { isLevelMapDifficulty } from "@/constants/level-map";
import type { LevelCompleteSummary } from "@/types/level-complete.types";

export type LevelResultRouteParams = {
  categoryId?: string | string[];
  categoryName?: string | string[];
  categoryIcon?: string | string[];
  difficulty?: string | string[];
  levelId?: string | string[];
  levelNumber?: string | string[];
  sessionId?: string | string[];
  score?: string | string[];
  xpEarned?: string | string[];
  correctAnswers?: string | string[];
  wrongAnswers?: string | string[];
  durationSeconds?: string | string[];
  isReplay?: string | string[];
  alreadyCompleted?: string | string[];
  passed?: string | string[];
};

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function getNonNegativeIntegerParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  if (!singleValue || !/^(0|[1-9]\d*)$/.test(singleValue)) {
    return null;
  }

  const parsedValue = Number(singleValue);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

function getPositiveIntegerParam(value: string | string[] | undefined) {
  const parsedValue = getNonNegativeIntegerParam(value);
  return parsedValue !== null && parsedValue > 0 ? parsedValue : null;
}

function getNonNegativeNumberParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  if (
    !singleValue ||
    !/^(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(singleValue)
  ) {
    return null;
  }

  const parsedValue = Number(singleValue);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}

function getBooleanParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  if (singleValue === "true") {
    return true;
  }
  if (singleValue === "false") {
    return false;
  }
  return null;
}

export function getLevelResultSummary(
  params: LevelResultRouteParams,
): LevelCompleteSummary | null {
  const categoryId = getPositiveIntegerParam(params.categoryId);
  const categoryName = getSingleParam(params.categoryName);
  const categoryIcon = getSingleParam(params.categoryIcon);
  const difficulty = getSingleParam(params.difficulty);
  const levelId = getPositiveIntegerParam(params.levelId);
  const levelNumber = getPositiveIntegerParam(params.levelNumber);
  const sessionId = getPositiveIntegerParam(params.sessionId);
  const score = getNonNegativeNumberParam(params.score);
  const xpEarned = getNonNegativeNumberParam(params.xpEarned);
  const correctAnswers = getNonNegativeIntegerParam(params.correctAnswers);
  const wrongAnswers = getNonNegativeIntegerParam(params.wrongAnswers);
  const durationSeconds = getNonNegativeIntegerParam(params.durationSeconds);
  const isReplay = getBooleanParam(params.isReplay);
  const alreadyCompleted = getBooleanParam(params.alreadyCompleted);
  const passed = getBooleanParam(params.passed);

  if (
    categoryId === null ||
    !categoryName?.trim() ||
    !categoryIcon ||
    !isLevelMapDifficulty(difficulty) ||
    levelId === null ||
    levelNumber === null ||
    sessionId === null ||
    score === null ||
    xpEarned === null ||
    correctAnswers === null ||
    wrongAnswers === null ||
    durationSeconds === null ||
    isReplay === null ||
    alreadyCompleted === null ||
    passed === null
  ) {
    return null;
  }

  const totalAnswers = correctAnswers + wrongAnswers;
  if (!Number.isSafeInteger(totalAnswers)) {
    return null;
  }

  return {
    categoryId,
    categoryName,
    categoryIcon,
    difficulty,
    levelId,
    levelNumber,
    sessionId,
    score,
    xpEarned,
    correctAnswers,
    wrongAnswers,
    totalAnswers,
    durationSeconds,
    isReplay,
    alreadyCompleted,
    passed,
  };
}
