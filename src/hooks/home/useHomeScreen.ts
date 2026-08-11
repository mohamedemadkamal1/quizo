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
import { getHome, HOME_QUERY_KEY } from '@/services/home.service';
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

function formatLastPlayedAt(value: string | null) {
  if (value === null) {
    return 'Not played yet';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function getItemIdentityKey(items: HomeItem[]) {
  return items
    .map((item) => item.id)
    .sort((first, second) => first - second)
    .join('|');
}

export function useHomeScreen() {
  const router = useRouter();
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
    queryKey: [...HOME_QUERY_KEY, userId],
    queryFn: getHome,
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
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

  const recentActivities = useMemo<RecentActivity[]>(
    () =>
      items.slice(0, 2).map((item) => ({
        id: item.id,
        statusLabel: item.isCompleted
          ? '\u2713 Completed'
          : `${Math.round(clampPercentage(item.completedPercentage))}% Complete`,
        activityName: item.name,
        xp: item.totalXp,
        day: `Level ${item.currentLevel} \u00B7 ${formatLastPlayedAt(item.lastPlayedAt)}`,
        icon: createElement(NotificationBellIcon, { size: 20 }),
      })),
    [items],
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
      if (navigationLockedRef.current) {
        return;
      }

      navigationLockedRef.current = true;
      router.push({
        pathname: '/(tabs)/level-map',
        params: {
          categoryId: category.id,
          difficulty: level.id,
        },
      });
    },
    [router],
  );

  const retry = useCallback(() => {
    void refetchHome();
  }, [refetchHome]);

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
    categoryLevels: CATEGORY_LEVELS,
    selectedCategory,
    isCategoryModalVisible,
    isInitialLoading: homeQuery.isPending && !hasHomeData,
    isInitialError: homeQuery.isError && !hasHomeData,
    errorMessage: homeQuery.isError
      ? getApiErrorMessage(homeQuery.error, 'Unable to load Home.')
      : null,
    isRefreshing: isPullRefreshing,
    isEmpty: hasHomeData && items.length === 0,
    retry,
    refresh,
    openCategoryModal,
    finishClosingCategoryModal,
    handleSelectCategoryLevel,
    contentBottomPadding: tabBarHeight + 24,
  };
}
