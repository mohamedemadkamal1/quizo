import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BackHandler } from "react-native";

import { isCategoryId, isLevelMapDifficulty } from "@/constants/level-map";
import type { LevelCompleteSummary } from "@/types/level-complete.types";

type RouteParams = {
  categoryId?: string | string[];
  difficulty?: string | string[];
  levelId?: string | string[];
  levelNumber?: string | string[];
  totalQuestions?: string | string[];
  correctAnswers?: string | string[];
  wrongAnswers?: string | string[];
  points?: string | string[];
  weeklyRank?: string | string[];
};

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function getIntegerParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  const parsedValue = singleValue === undefined ? NaN : Number(singleValue);
  return Number.isInteger(parsedValue) ? parsedValue : null;
}

function getSummary(params: RouteParams): LevelCompleteSummary | null {
  const categoryId = getSingleParam(params.categoryId);
  const difficulty = getSingleParam(params.difficulty);
  const levelId = getSingleParam(params.levelId);
  const levelNumber = getIntegerParam(params.levelNumber);
  const totalQuestions = getIntegerParam(params.totalQuestions);
  const correctAnswers = getIntegerParam(params.correctAnswers);
  const wrongAnswers = getIntegerParam(params.wrongAnswers);
  const points = getIntegerParam(params.points);
  const weeklyRank = getIntegerParam(params.weeklyRank);

  if (
    !isCategoryId(categoryId) ||
    !isLevelMapDifficulty(difficulty) ||
    !levelId ||
    levelNumber === null ||
    levelNumber <= 0 ||
    totalQuestions === null ||
    totalQuestions <= 0 ||
    correctAnswers === null ||
    correctAnswers < 0 ||
    wrongAnswers === null ||
    wrongAnswers < 0 ||
    correctAnswers + wrongAnswers !== totalQuestions ||
    points === null ||
    points < 0 ||
    weeklyRank === null ||
    weeklyRank <= 0
  ) {
    return null;
  }

  return {
    categoryId,
    difficulty,
    levelId,
    levelNumber,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    points,
    weeklyRank,
  };
}

export function useLevelCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();
  const navigationLockedRef = useRef(false);
  const summary = useMemo(() => getSummary(params), [params]);

  const handleBackToMap = useCallback(() => {
    if (navigationLockedRef.current || !summary) {
      return;
    }

    navigationLockedRef.current = true;
    router.dismissTo({
      pathname: "/(tabs)/level-map",
      params: {
        categoryId: summary.categoryId,
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
      ? summary.correctAnswers === summary.totalQuestions
      : false,
    handleBackToMap,
    handleHome,
    handleLeaderboard,
  };
}
