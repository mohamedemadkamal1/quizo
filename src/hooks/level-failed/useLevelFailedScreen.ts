import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler } from "react-native";

import { useTranslation } from "@/hooks/useTranslation";
import {
  getLevelMapQueryKey,
  LEVEL_MAP_LIMIT,
  LEVEL_MAP_PAGE,
} from "@/services/level-map.service";
import { HOME_QUERY_KEY } from "@/services/home.service";
import {
  getSessionQuestionsQueryKey,
  startLevel,
} from "@/services/questions.service";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/utils/get-api-error-message";
import { getEarnedStars } from "@/utils/get-earned-stars";
import {
  getLevelResultSummary,
  type LevelResultRouteParams,
} from "@/utils/level-result-route";

export function useLevelFailedScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.session?.user.id);
  const params = useLocalSearchParams<LevelResultRouteParams>();
  const navigationLockedRef = useRef(false);
  const retryInFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const [retryErrorMessage, setRetryErrorMessage] = useState<string | null>(
    null,
  );
  const startLevelMutation = useMutation({
    mutationFn: startLevel,
    retry: false,
  });

  const summary = useMemo(() => {
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

    return parsedSummary && !parsedSummary.passed ? parsedSummary : null;
  }, [
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
  ]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      retryInFlightRef.current = false;
    };
  }, []);

  const removeCompletedSession = useCallback(() => {
    if (!summary) {
      return;
    }

    queryClient.removeQueries({
      exact: true,
      queryKey: getSessionQuestionsQueryKey(summary.sessionId),
    });
  }, [queryClient, summary]);

  const refreshProgressQueries = useCallback(() => {
    if (!summary) {
      return;
    }

    void queryClient.invalidateQueries({
      exact: true,
      queryKey: getLevelMapQueryKey({
        subCategoryId: summary.categoryId,
        stage: summary.difficulty,
        page: LEVEL_MAP_PAGE,
        limit: LEVEL_MAP_LIMIT,
      }),
    });

    if (userId) {
      void queryClient.invalidateQueries({
        exact: true,
        queryKey: [...HOME_QUERY_KEY, userId],
      });
    }
  }, [queryClient, summary, userId]);

  const handleTryAgain = useCallback(async () => {
    if (!summary || navigationLockedRef.current || retryInFlightRef.current) {
      return;
    }

    retryInFlightRef.current = true;
    setRetryErrorMessage(null);
    startLevelMutation.reset();

    try {
      const newSession = await startLevelMutation.mutateAsync({
        levelId: summary.levelId,
        subCategoryId: summary.categoryId,
      });

      if (
        !mountedRef.current ||
        newSession.id <= 0 ||
        newSession.id === summary.sessionId
      ) {
        throw new Error(t("levelFailed.invalidSession"));
      }

      navigationLockedRef.current = true;
      removeCompletedSession();
      queryClient.removeQueries({
        exact: true,
        queryKey: getSessionQuestionsQueryKey(newSession.id),
      });
      router.replace({
        pathname: "/questions",
        params: {
          categoryId: summary.categoryId,
          categoryName: summary.categoryName,
          categoryIcon: summary.categoryIcon,
          difficulty: summary.difficulty,
          levelId: summary.levelId,
          levelNumber: summary.levelNumber,
          sessionId: newSession.id,
        },
      });
    } catch (error: unknown) {
      if (mountedRef.current) {
        retryInFlightRef.current = false;
        setRetryErrorMessage(
          getApiErrorMessage(error, t("levelFailed.retryErrorFallback")),
        );
      }
    }
  }, [
    queryClient,
    removeCompletedSession,
    router,
    startLevelMutation,
    summary,
    t,
  ]);

  const handleBackToMap = useCallback(() => {
    if (navigationLockedRef.current || retryInFlightRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    removeCompletedSession();
    refreshProgressQueries();

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
  }, [refreshProgressQueries, removeCompletedSession, router, summary]);

  const handleHome = useCallback(() => {
    if (navigationLockedRef.current || retryInFlightRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    removeCompletedSession();
    refreshProgressQueries();
    router.dismissTo("/(tabs)/home");
  }, [refreshProgressQueries, removeCompletedSession, router]);

  const handleLeaderboard = useCallback(() => {
    if (navigationLockedRef.current || retryInFlightRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    removeCompletedSession();
    refreshProgressQueries();
    router.dismissTo("/(tabs)/leaderboard");
  }, [refreshProgressQueries, removeCompletedSession, router]);

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
    earnedStars: summary
      ? getEarnedStars(summary.correctAnswers, summary.totalAnswers)
      : 0,
    isRetrying: startLevelMutation.isPending,
    retryErrorMessage,
    handleTryAgain,
    handleBackToMap,
    handleHome,
    handleLeaderboard,
  };
}
