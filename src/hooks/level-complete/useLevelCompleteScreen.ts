import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BackHandler } from "react-native";

import {
  getLevelResultSummary,
  type LevelResultRouteParams,
} from "@/utils/level-result-route";

export function useLevelCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<LevelResultRouteParams>();
  const navigationLockedRef = useRef(false);
  const summary = useMemo(
    () =>
      (() => {
        const parsedSummary = getLevelResultSummary({
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
          passed: params.passed,
        });

        return parsedSummary?.passed && parsedSummary.totalAnswers > 0
          ? parsedSummary
          : null;
      })(),
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
      params.passed,
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
