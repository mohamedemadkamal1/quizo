import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useCallback, useMemo, useRef } from 'react';

import {
  HOME_CATEGORY_COLOR_PALETTE,
  HOME_CATEGORY_ICONS,
} from '@/constants/home';
import { useTranslation } from '@/hooks/useTranslation';
import { getHome, HOME_QUERY_KEY } from '@/services/home.service';
import { useAuthStore } from '@/store/auth.store';
import type { HomeItem } from '@/types/home.types';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { getSafeNonNegativeValue } from '@/utils/profile';

const EMPTY_HOME_ITEMS: HomeItem[] = [];

export function useProfileProgressScreen() {
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const userId = useAuthStore((state) => state.session?.user.id);
  const hasFocusedOnceRef = useRef(false);
  const homeQuery = useQuery({
    queryKey: [...HOME_QUERY_KEY, userId],
    queryFn: getHome,
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
  const refetchHome = homeQuery.refetch;

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnceRef.current) {
        void refetchHome({ cancelRefetch: false });
      } else {
        hasFocusedOnceRef.current = true;
      }
    }, [refetchHome]),
  );

  const items = homeQuery.data?.items ?? EMPTY_HOME_ITEMS;
  const totals = useMemo(
    () =>
      items.reduce(
        (current, item) => ({
          xpEarned: current.xpEarned + getSafeNonNegativeValue(item.totalXp),
          completedLevels:
            current.completedLevels +
            getSafeNonNegativeValue(item.completedLevels),
        }),
        { xpEarned: 0, completedLevels: 0 },
      ),
    [items],
  );
  const topAchievements = useMemo(
    () =>
      items
        .map((item, index) => ({ item, originalIndex: index }))
        .sort(
          (first, second) =>
            getSafeNonNegativeValue(second.item.totalXp) -
              getSafeNonNegativeValue(first.item.totalXp) ||
            first.originalIndex - second.originalIndex,
        )
        .slice(0, 3)
        .map(({ item, originalIndex }) => ({
          item,
          icon: HOME_CATEGORY_ICONS[originalIndex % HOME_CATEGORY_ICONS.length],
          gradient:
            HOME_CATEGORY_COLOR_PALETTE[
              originalIndex % HOME_CATEGORY_COLOR_PALETTE.length
            ],
        })),
    [items],
  );
  const categories = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        icon: HOME_CATEGORY_ICONS[index % HOME_CATEGORY_ICONS.length],
        gradient:
          HOME_CATEGORY_COLOR_PALETTE[
            index % HOME_CATEGORY_COLOR_PALETTE.length
          ],
      })),
    [items],
  );
  const hasData = homeQuery.data !== undefined;

  return {
    ...totals,
    topAchievements,
    categories,
    isInitialLoading: homeQuery.isPending && !hasData,
    isInitialError: homeQuery.isError && !hasData,
    isEmpty: hasData && items.length === 0,
    errorMessage: homeQuery.isError
      ? getApiErrorMessage(
          homeQuery.error,
          t('profile.progressScreen.errorFallback'),
        )
      : null,
    isRetrying: homeQuery.isFetching,
    contentBottomPadding: tabBarHeight + 24,
    retry: () => {
      void refetchHome();
    },
  };
}
