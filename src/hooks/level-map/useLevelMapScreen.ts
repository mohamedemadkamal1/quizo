import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HOME_CATEGORIES } from '@/constants/home';
import {
  isCategoryId,
  isLevelMapDifficulty,
  levelMapThemes,
  LOCKED_PREVIEW_COUNT,
} from '@/constants/level-map';
import { getLevelMap } from '@/services/level-map.service';
import type {
  LevelMapLevel,
  LevelMapResponse,
  VisibleLevelMap,
} from '@/types/level-map.types';
import { deriveVisibleLevelMap } from '@/utils/derive-visible-level-map';

type RouteParams = {
  categoryId?: string | string[];
  difficulty?: string | string[];
};

type ReadyState = {
  status: 'ready';
  response: LevelMapResponse;
  derived: VisibleLevelMap;
};

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string; requestKey: string }
  | ReadyState;

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

export function useLevelMapScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const params = useLocalSearchParams<RouteParams>();
  const categoryIdParam = getSingleParam(params.categoryId);
  const difficultyParam = getSingleParam(params.difficulty);
  const routeIsValid =
    isCategoryId(categoryIdParam) &&
    isLevelMapDifficulty(difficultyParam);
  const requestKey = routeIsValid
    ? `${categoryIdParam}:${difficultyParam}`
    : null;
  const [loadState, setLoadState] = useState<LoadState>({
    status: 'loading',
  });
  const [selectedLevel, setSelectedLevel] = useState<LevelMapLevel | null>(
    null,
  );
  const [isLevelStartModalVisible, setIsLevelStartModalVisible] =
    useState(false);
  const isStartingLevelRef = useRef(false);

  useEffect(() => {
    if (!routeIsValid) {
      return;
    }

    let isActive = true;

    void getLevelMap(categoryIdParam, difficultyParam)
      .then((response) => {
        if (!isActive) {
          return;
        }

        if (
          response.categoryId !== categoryIdParam ||
          response.difficulty !== difficultyParam ||
          response.totalLevels !== response.levels.length
        ) {
          throw new Error('The level-map response does not match the request.');
        }

        const derived = deriveVisibleLevelMap(
          response.levels,
          LOCKED_PREVIEW_COUNT,
        );
        setLoadState({ status: 'ready', response, derived });
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setLoadState({
          status: 'error',
          requestKey: `${categoryIdParam}:${difficultyParam}`,
          message:
            error instanceof Error
              ? error.message
              : 'Unable to load this level map.',
        });
      });

    return () => {
      isActive = false;
    };
  }, [categoryIdParam, difficultyParam, routeIsValid]);

  const category = routeIsValid
    ? HOME_CATEGORIES.find((item) => item.id === categoryIdParam) ?? null
    : null;
  const theme = routeIsValid ? levelMapThemes[difficultyParam] : null;
  const loadStateMatchesRequest =
    requestKey !== null &&
    (loadState.status === 'ready'
      ? `${loadState.response.categoryId}:${loadState.response.difficulty}` ===
        requestKey
      : loadState.status === 'error' && loadState.requestKey === requestKey);
  const presentationLevels = useMemo(
    () =>
      loadState.status === 'ready'
        ? loadState.derived.visibleLevels.slice().reverse()
        : [],
    [loadState],
  );
  const initialScrollIndex =
    loadState.status === 'ready'
      ? Math.max(
          0,
          presentationLevels.findIndex(
            (level) => level.id === loadState.derived.currentLevel?.id,
          ),
        )
      : 0;

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handlePressLevel = useCallback((level: LevelMapLevel) => {
    if (level.status !== 'current') {
      return;
    }

    isStartingLevelRef.current = false;
    setSelectedLevel(level);
    setIsLevelStartModalVisible(true);
  }, []);

  const handleCloseLevelStartModal = useCallback(() => {
    isStartingLevelRef.current = false;
    setIsLevelStartModalVisible(false);
    setSelectedLevel(null);
  }, []);

  const handleStartSelectedLevel = useCallback(() => {
    if (
      !selectedLevel ||
      !isCategoryId(categoryIdParam) ||
      !isLevelMapDifficulty(difficultyParam) ||
      isStartingLevelRef.current
    ) {
      return;
    }

    const levelToStart = selectedLevel;
    isStartingLevelRef.current = true;
    setIsLevelStartModalVisible(false);
    setSelectedLevel(null);

    router.push({
      pathname: '/questions',
      params: {
        categoryId: categoryIdParam,
        difficulty: difficultyParam,
        levelId: levelToStart.id,
        levelNumber: levelToStart.number,
      },
    });
  }, [categoryIdParam, difficultyParam, router, selectedLevel]);

  return {
    status: !routeIsValid
      ? ('invalid' as const)
      : loadStateMatchesRequest
        ? loadState.status
        : ('loading' as const),
    errorMessage:
      loadState.status === 'error' && loadStateMatchesRequest
        ? loadState.message
        : undefined,
    category,
    theme,
    response:
      loadState.status === 'ready' && loadStateMatchesRequest
        ? loadState.response
        : null,
    derived:
      loadState.status === 'ready' && loadStateMatchesRequest
        ? loadState.derived
        : null,
    presentationLevels,
    initialScrollIndex,
    contentBottomPadding: tabBarHeight + 24,
    selectedLevel,
    isLevelStartModalVisible,
    handleClose,
    handlePressLevel,
    handleCloseLevelStartModal,
    handleStartSelectedLevel,
  };
}
