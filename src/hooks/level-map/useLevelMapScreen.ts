import { useMutation, useQuery } from '@tanstack/react-query';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isLevelMapDifficulty, levelMapThemes } from '@/constants/level-map';
import {
  getLevelMap,
  getLevelMapQueryKey,
  LEVEL_MAP_LIMIT,
  LEVEL_MAP_PAGE,
} from '@/services/level-map.service';
import { startLevel } from '@/services/questions.service';
import type { LevelMapLevel } from '@/types/level-map.types';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { mapLevelMapItems } from '@/utils/map-level-map-items';
import { createLevelMapDecorationPlan } from '@/utils/create-level-map-decoration-plan';

type RouteParams = {
  categoryId?: string | string[];
  categoryName?: string | string[];
  categoryIcon?: string | string[];
  difficulty?: string | string[];
};

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

function getPositiveIntegerParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  const parsedValue = singleValue === undefined ? NaN : Number(singleValue);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

export function useLevelMapScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const params = useLocalSearchParams<RouteParams>();
  const subCategoryId = getPositiveIntegerParam(params.categoryId);
  const categoryName = getSingleParam(params.categoryName);
  const categoryIcon = getSingleParam(params.categoryIcon);
  const stageParam = getSingleParam(params.difficulty);
  const hasValidRoute =
    subCategoryId !== null &&
    Boolean(categoryName?.trim()) &&
    Boolean(categoryIcon) &&
    isLevelMapDifficulty(stageParam);
  const stage = isLevelMapDifficulty(stageParam) ? stageParam : null;
  const requestParams = {
    subCategoryId: subCategoryId ?? 0,
    stage: stage ?? 'BEGINNER',
    page: LEVEL_MAP_PAGE,
    limit: LEVEL_MAP_LIMIT,
  } as const;
  const [selectedLevel, setSelectedLevel] = useState<LevelMapLevel | null>(
    null,
  );
  const [isLevelStartModalVisible, setIsLevelStartModalVisible] =
    useState(false);
  const hasFocusedOnceRef = useRef(false);
  const mountedRef = useRef(true);
  const isSelectingLevelRef = useRef(false);
  const isStartingLevelRef = useRef(false);

  const levelMapQuery = useQuery({
    queryKey: getLevelMapQueryKey(requestParams),
    queryFn: () => getLevelMap(requestParams),
    enabled: hasValidRoute,
    refetchOnWindowFocus: false,
  });
  const startLevelMutation = useMutation({
    mutationFn: startLevel,
    retry: false,
  });

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetchLevelMap = levelMapQuery.refetch;

  useFocusEffect(
    useCallback(() => {
      if (!hasValidRoute) {
        return;
      }

      isSelectingLevelRef.current = false;
      isStartingLevelRef.current = false;

      if (hasFocusedOnceRef.current) {
        void refetchLevelMap({ cancelRefetch: false });
      } else {
        hasFocusedOnceRef.current = true;
      }
    }, [hasValidRoute, refetchLevelMap]),
  );

  const levels = useMemo(
    () => mapLevelMapItems(levelMapQuery.data?.items ?? []),
    [levelMapQuery.data?.items],
  );
  const presentationLevels = useMemo(() => levels.slice().reverse(), [levels]);
  const currentLevel =
    levels.find((level) => level.viewState === 'in-progress') ??
    levels.find((level) => level.viewState === 'available') ??
    null;
  const initialScrollIndex = Math.max(
    0,
    presentationLevels.findIndex((level) => level.id === currentLevel?.id),
  );
  const category = hasValidRoute
    ? {
        id: subCategoryId!,
        name: categoryName!,
        icon: categoryIcon!,
      }
    : null;
  const theme = stage ? levelMapThemes[stage] : null;
  const decorationPlan = useMemo(
    () =>
      subCategoryId !== null && stage && theme
        ? createLevelMapDecorationPlan({
            subCategoryId,
            difficulty: stage,
            orderedLevels: levels,
            theme,
          })
        : new Map(),
    [levels, stage, subCategoryId, theme],
  );
  const hasData = levelMapQuery.data !== undefined;

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleRetry = useCallback(() => {
    if (!hasValidRoute || levelMapQuery.isFetching) {
      return;
    }

    void refetchLevelMap();
  }, [hasValidRoute, levelMapQuery.isFetching, refetchLevelMap]);

  const handlePressLevel = useCallback(
    (level: LevelMapLevel) => {
      if (!level.isPlayable || isSelectingLevelRef.current) {
        return;
      }

      isSelectingLevelRef.current = true;
      isStartingLevelRef.current = false;
      startLevelMutation.reset();
      setSelectedLevel(level);
      setIsLevelStartModalVisible(true);
    },
    [setIsLevelStartModalVisible, setSelectedLevel, startLevelMutation],
  );

  const handleCloseLevelStartModal = useCallback(() => {
    if (isStartingLevelRef.current) {
      return;
    }

    isSelectingLevelRef.current = false;
    isStartingLevelRef.current = false;
    startLevelMutation.reset();
    setIsLevelStartModalVisible(false);
    setSelectedLevel(null);
  }, [setIsLevelStartModalVisible, setSelectedLevel, startLevelMutation]);

  const handleStartSelectedLevel = useCallback(async () => {
    const currentSelectedLevel = selectedLevel
      ? levels.find((level) => level.id === selectedLevel.id)
      : null;

    if (
      !currentSelectedLevel?.isPlayable ||
      subCategoryId === null ||
      !categoryName ||
      !categoryIcon ||
      !stage ||
      isStartingLevelRef.current
    ) {
      return;
    }

    isStartingLevelRef.current = true;
    startLevelMutation.reset();

    try {
      const sessionId =
        currentSelectedLevel.viewState === 'in-progress'
          ? currentSelectedLevel.activeSessionId
          : (
              await startLevelMutation.mutateAsync({
                levelId: currentSelectedLevel.id,
                subCategoryId,
              })
            ).id;

      if (
        !mountedRef.current ||
        !Number.isInteger(sessionId) ||
        sessionId === null ||
        sessionId <= 0
      ) {
        throw new Error('A valid gameplay session was not returned.');
      }

      setIsLevelStartModalVisible(false);
      setSelectedLevel(null);
      router.push({
        pathname: '/questions',
        params: {
          categoryId: subCategoryId,
          categoryName,
          categoryIcon,
          difficulty: stage,
          levelId: currentSelectedLevel.id,
          levelNumber: currentSelectedLevel.number,
          sessionId,
        },
      });
    } catch {
      if (mountedRef.current) {
        isStartingLevelRef.current = false;
      }
    }
  }, [
    categoryIcon,
    categoryName,
    levels,
    router,
    selectedLevel,
    setIsLevelStartModalVisible,
    setSelectedLevel,
    stage,
    startLevelMutation,
    subCategoryId,
  ]);

  const status = !hasValidRoute
    ? ('invalid' as const)
    : levelMapQuery.isPending && !hasData
      ? ('loading' as const)
      : levelMapQuery.isError && !hasData
        ? ('error' as const)
        : hasData && levels.length === 0
          ? ('empty' as const)
          : ('ready' as const);

  return {
    status,
    errorMessage: levelMapQuery.isError
      ? getApiErrorMessage(
          levelMapQuery.error,
          'Unable to load this level map.',
        )
      : null,
    isRetrying: levelMapQuery.isFetching,
    category,
    theme,
    data: levelMapQuery.data ?? null,
    progress: levelMapQuery.data?.progress ?? null,
    presentationLevels,
    decorationPlan,
    currentLevel,
    initialScrollIndex,
    hasMoreLevels: levelMapQuery.data?.meta.hasNextPage ?? false,
    contentBottomPadding: tabBarHeight + 24,
    selectedLevel,
    isLevelStartModalVisible,
    isStartingLevel: startLevelMutation.isPending,
    startLevelErrorMessage: startLevelMutation.isError
      ? getApiErrorMessage(
          startLevelMutation.error,
          'Unable to start this level. Please try again.',
        )
      : null,
    handleClose,
    handleRetry,
    handlePressLevel,
    handleCloseLevelStartModal,
    handleStartSelectedLevel,
  };
}
