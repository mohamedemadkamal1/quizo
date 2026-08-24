import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { createElement, useCallback, useMemo, useRef, useState } from 'react';

import { NotificationBellIcon } from '@/components/common/icons/NotificationBellIcon';
import {
  CATEGORY_LEVELS,
  HOME_CATEGORY_COLOR_PALETTE,
  HOME_CATEGORY_ICONS,
} from '@/constants/home';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getHome,
  getHomeQueryKey,
  getSubCategoryLevelCounts,
  getSubCategoryLevelCountsQueryKey,
} from '@/services/home.service';
import { useAuthStore } from '@/store/auth.store';
import type {
  CategoryLevel,
  HomeCategory,
  HomeItem,
  RecentActivity,
} from '@/types/home.types';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

const EMPTY_HOME_ITEMS: HomeItem[] = [];

function shuffle<T>(values: readonly T[]): T[] {
  const shuffled = values.slice();

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function getItemIdentityKey(items: HomeItem[]) {
  return items
    .map((item) => item.id)
    .sort((first, second) => first - second)
    .join('|');
}

export function useHomeScreen() {
  const router = useRouter();
  const { t, formatShortDate, language } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const session = useAuthStore((state) => state.session);
  const displayName = session?.user.displayName;
  const userId = session?.user.id;
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(
    null,
  );
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const hasFocusedOnceRef = useRef(false);
  const isOpeningCategoryRef = useRef(false);
  const navigationLockedRef = useRef(false);

  const homeQuery = useQuery({
    queryKey: getHomeQueryKey(userId, language),
    queryFn: getHome,
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });

  const subCatId = selectedCategory?.id ?? null;
  const hasValidSubCatId = isPositiveInteger(subCatId);
  const levelCountsQuery = useQuery({
    queryKey: getSubCategoryLevelCountsQueryKey(subCatId, language),
    queryFn: () => {
      if (!isPositiveInteger(subCatId)) {
        throw new Error('A valid subcategory ID is required.');
      }

      return getSubCategoryLevelCounts(subCatId);
    },
    enabled: isCategoryModalVisible && hasValidSubCatId,
  });

  const refetchHome = homeQuery.refetch;

  useFocusEffect(
    useCallback(() => {
      navigationLockedRef.current = false;

      if (hasFocusedOnceRef.current) {
        void refetchHome({ cancelRefetch: false });
      } else {
        hasFocusedOnceRef.current = true;
      }
    }, [refetchHome]),
  );

  const items = homeQuery.data?.items ?? EMPTY_HOME_ITEMS;
  const itemIdentityKey = getItemIdentityKey(items);
  const shuffledIcons = useMemo(() => {
    if (itemIdentityKey.length === 0) {
      return HOME_CATEGORY_ICONS.slice();
    }

    return shuffle(HOME_CATEGORY_ICONS);
  }, [itemIdentityKey]);

  const categories = useMemo<HomeCategory[]>(
    () =>
      items.map((item, index) => {
        const displayedProgress = clampPercentage(item.completedPercentage);

        return {
          id: item.id,
          name: item.name,
          icon: shuffledIcons[index % shuffledIcons.length],
          levelCount: item.totalLevels,
          xp: item.totalXp,
          displayedProgress,
          visualFillRatio: displayedProgress / 100,
          gradient:
            HOME_CATEGORY_COLOR_PALETTE[
              index % HOME_CATEGORY_COLOR_PALETTE.length
            ],
        };
      }),
    [items, shuffledIcons],
  );

  const formatLastPlayedAt = useCallback(
    (value: string | null) => {
      if (value === null) {
        return t('home.activityNeverPlayed');
      }

      const date = new Date(value);

      return Number.isNaN(date.getTime())
        ? t('home.activityDateUnavailable')
        : formatShortDate(date);
    },
    [formatShortDate, t],
  );

  const recentActivities = useMemo<RecentActivity[]>(
    () =>
      items.slice(0, 2).map((item) => ({
        id: item.id,
        statusLabel: item.isCompleted
          ? t('home.activityCompleted')
          : t('home.activityProgress', {
              percent: Math.round(clampPercentage(item.completedPercentage)),
            }),
        activityName: item.name,
        xp: item.totalXp,
        day: t('home.activityDay', {
          level: item.currentLevel,
          date: formatLastPlayedAt(item.lastPlayedAt),
        }),
        icon: createElement(NotificationBellIcon, { size: 20 }),
      })),
    [formatLastPlayedAt, items, t],
  );

  const categoryLevels = useMemo<CategoryLevel[]>(
    () =>
      levelCountsQuery.data
        ? CATEGORY_LEVELS.map((config) => {
            const progress = levelCountsQuery.data[config.difficulty];

            return {
              ...config,
              levelCount: progress.totalLevels,
              completedLevels: progress.completedLevels,
            };
          })
        : [],
    [levelCountsQuery.data],
  );

  const openCategoryModal = useCallback((category: HomeCategory) => {
    if (isOpeningCategoryRef.current || navigationLockedRef.current) {
      return;
    }

    isOpeningCategoryRef.current = true;
    setSelectedCategory(category);
    setIsCategoryModalVisible(true);
  }, []);

  const finishClosingCategoryModal = useCallback(() => {
    isOpeningCategoryRef.current = false;
    setIsCategoryModalVisible(false);
    setSelectedCategory(null);
  }, []);

  const handleSelectCategoryLevel = useCallback(
    (category: HomeCategory, level: CategoryLevel) => {
      if (navigationLockedRef.current || level.levelCount <= 0) {
        return;
      }

      navigationLockedRef.current = true;
      router.push({
        pathname: '/(tabs)/level-map',
        params: {
          categoryId: category.id,
          categoryName: category.name,
          categoryIcon: category.icon,
          difficulty: level.difficulty,
        },
      });
    },
    [router],
  );

  const retry = useCallback(() => {
    void refetchHome();
  }, [refetchHome]);

  const retryCategoryLevels = useCallback(() => {
    if (!hasValidSubCatId || levelCountsQuery.isFetching) {
      return;
    }

    void levelCountsQuery.refetch();
  }, [hasValidSubCatId, levelCountsQuery]);

  const refresh = useCallback(async () => {
    if (isPullRefreshing) {
      return;
    }

    setIsPullRefreshing(true);

    try {
      await refetchHome({ cancelRefetch: false });
    } finally {
      setIsPullRefreshing(false);
    }
  }, [isPullRefreshing, refetchHome]);

  const hasHomeData = homeQuery.data !== undefined;

  return {
    displayName,
    homeData: homeQuery.data,
    recentActivities,
    categories,
    categoryLevels,
    selectedCategory,
    isCategoryModalVisible,
    categoryLevelStatus: !hasValidSubCatId
      ? ('invalid' as const)
      : levelCountsQuery.data
        ? ('ready' as const)
        : levelCountsQuery.isError
          ? ('error' as const)
          : ('loading' as const),
    categoryLevelErrorMessage: levelCountsQuery.isError
      ? getApiErrorMessage(
          levelCountsQuery.error,
          t('home.levelModal.errorFallback'),
        )
      : null,
    isRetryingCategoryLevels: levelCountsQuery.isFetching,
    isInitialLoading: homeQuery.isPending && !hasHomeData,
    isInitialError: homeQuery.isError && !hasHomeData,
    errorMessage: homeQuery.isError
      ? getApiErrorMessage(homeQuery.error, t('home.errorFallback'))
      : null,
    isRefreshing: isPullRefreshing,
    isEmpty: hasHomeData && items.length === 0,
    retry,
    retryCategoryLevels,
    refresh,
    openCategoryModal,
    finishClosingCategoryModal,
    handleSelectCategoryLevel,
    contentBottomPadding: tabBarHeight + 24,
  };
}
