import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BackHandler } from "react-native";

import { isLevelMapDifficulty } from "@/constants/level-map";
import type { LevelCompleteSummary } from "@/types/level-complete.types";

type RouteParams = {
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

function getSummary(params: RouteParams): LevelCompleteSummary | null {
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
    alreadyCompleted === null
  ) {
    return null;
  }

  const totalAnswers = correctAnswers + wrongAnswers;
  if (!Number.isSafeInteger(totalAnswers) || totalAnswers <= 0) {
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
  };
}

export function useLevelCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();
  const navigationLockedRef = useRef(false);
  const summary = useMemo(
    () =>
      getSummary({
        categoryId: params.categoryId,
        categoryName: params.categoryName,
        categoryIcon: params.categoryIcon,
        difficulty: params.difficulty,
        levelId: params.levelId,
        levelNumber: params.levelNumber,
        sessionId: params.sessionId,
        score: params.score,
        xpEarned: params.xpEarned,
        correctAnswers: params.correctAnswers,
        wrongAnswers: params.wrongAnswers,
        durationSeconds: params.durationSeconds,
        isReplay: params.isReplay,
        alreadyCompleted: params.alreadyCompleted,
      }),
    [
      params.alreadyCompleted,
      params.categoryIcon,
      params.categoryId,
      params.categoryName,
      params.correctAnswers,
      params.difficulty,
      params.durationSeconds,
      params.isReplay,
      params.levelId,
      params.levelNumber,
      params.score,
      params.sessionId,
      params.wrongAnswers,
      params.xpEarned,
    ],
  );

  const handleBackToMap = useCallback(() => {
    if (navigationLockedRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    if (!summary) {
      router.dismissTo("/(tabs)/home");
      return;
    }

    router.dismissTo({
      pathname: "/(tabs)/level-map",
      params: {
        categoryId: summary.categoryId,
        categoryName: summary.categoryName,
        categoryIcon: summary.categoryIcon,
        difficulty: summary.difficulty,
      },
    });
  }, [router, summary]);

  const handleHome = useCallback(() => {
    if (navigationLockedRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    router.dismissTo("/(tabs)/home");
  }, [router]);

  const handleLeaderboard = useCallback(() => {
    if (navigationLockedRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    router.dismissTo("/(tabs)/leaderboard");
  }, [router]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackToMap();
        return true;
      },
    );

    return () => subscription.remove();
  }, [handleBackToMap]);

  return {
    summary,
    isPerfect: summary
      ? summary.correctAnswers === summary.totalAnswers
      : false,
    handleBackToMap,
    handleHome,
    handleLeaderboard,
  };
}
