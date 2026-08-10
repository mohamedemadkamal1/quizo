import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { createElement, useCallback, useState } from 'react';

import { NotificationBellIcon } from '@/components/common/icons/NotificationBellIcon';
import { CATEGORY_LEVELS, HOME_CATEGORIES } from '@/constants/home';
import { useAuthStore } from '@/store/auth.store';
import type {
  CategoryLevel,
  HomeCategory,
  RecentActivity,
} from '@/types/home.types';

export function useHomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const displayName = useAuthStore((state) => state.session?.user.displayName);
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(
    null,
  );
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const recentActivities: RecentActivity[] = [
    {
      id: 'stories-today',
      statusLabel: '\u2713 Completed',
      activityName: 'Hadeeth',
      xp: 40,
      day: 'Level 5',
      icon: createElement(NotificationBellIcon, { size: 20 }),
    },
    {
      id: 'quran-level-6',
      statusLabel: '\u2713 Completed',
      activityName: 'Quran',
      xp: 50,
      day: 'Level 6',
      icon: createElement(NotificationBellIcon, { size: 20 }),
    },
  ];

  const openCategoryModal = useCallback((category: HomeCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalVisible(true);
  }, []);

  const finishClosingCategoryModal = useCallback(() => {
    setIsCategoryModalVisible(false);
    setSelectedCategory(null);
  }, []);

  const handleSelectCategoryLevel = useCallback(
    (category: HomeCategory, level: CategoryLevel) => {
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

  return {
    displayName,
    recentActivities,
    categories: HOME_CATEGORIES,
    categoryLevels: CATEGORY_LEVELS,
    selectedCategory,
    isCategoryModalVisible,
    openCategoryModal,
    finishClosingCategoryModal,
    handleSelectCategoryLevel,
    contentBottomPadding: tabBarHeight + 24,
  };
}
