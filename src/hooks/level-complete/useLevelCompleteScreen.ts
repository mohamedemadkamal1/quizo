import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { BackHandler } from "react-native";

import type { LevelCompleteLeaderboardRouteParams } from '@/types/leaderboard.types';
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
    if (navigationLockedRef.current || !summary) {
      return;
    }

    navigationLockedRef.current = true;
    const leaderboardParams = {
      categoryId: String(summary.categoryId),
      levelId: String(summary.levelId),
      levelNumber: String(summary.levelNumber),
      sessionId: String(summary.sessionId),
    } satisfies LevelCompleteLeaderboardRouteParams;

    router.push({
      pathname: "/level-complete-leaderboard",
      params: leaderboardParams,
    });
  }, [router, summary]);

  useFocusEffect(
    useCallback(() => {
      navigationLockedRef.current = false;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleBackToMap();
          return true;
        },
      );

      return () => subscription.remove();
    }, [handleBackToMap]),
  );

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
