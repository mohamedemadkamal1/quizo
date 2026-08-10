import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { createElement, useCallback, useState } from 'react';

import { NotificationBellIcon } from '@/components/common/icons/NotificationBellIcon';
import { gradients } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import type {
  CategoryLevel,
  HomeCategory,
  RecentActivity,
} from '@/types/home.types';

const categories: HomeCategory[] = [
  {
    id: 'quran',
    name: 'Quran',
    icon: '🌙',
    levelCount: 12,
    xp: 50,
    displayedProgress: 85,
    visualFillRatio: 0.47882,
    gradient: gradients.categories.quran,
  },
  {
    id: 'seerah',
    name: 'Seerah',
    icon: '🕌',
    levelCount: 10,
    xp: 45,
    displayedProgress: 60,
    visualFillRatio: 0.33797,
    gradient: gradients.categories.seerah,
  },
  {
    id: 'duas',
    name: 'Duas',
    icon: '🤲',
    levelCount: 8,
    xp: 40,
    displayedProgress: 40,
    visualFillRatio: 0.22533,
    gradient: gradients.categories.duas,
  },
  {
    id: 'prophets',
    name: 'Prophets',
    icon: '📖',
    levelCount: 15,
    xp: 60,
    displayedProgress: 25,
    visualFillRatio: 0.1408,
    gradient: gradients.categories.prophets,
  },
  {
    id: 'good-manners',
    name: 'Good Manners',
    icon: '⭐',
    levelCount: 9,
    xp: 45,
    displayedProgress: 70,
    visualFillRatio: 0.39434,
    gradient: gradients.categories.goodManners,
  },
  {
    id: 'islamic-quiz',
    name: 'Islamic Quiz',
    icon: '🧠',
    levelCount: 20,
    xp: 70,
    displayedProgress: 15,
    visualFillRatio: 0.08448,
    gradient: gradients.categories.islamicQuiz,
  },
  {
    id: 'companions',
    name: 'Companions',
    icon: '🐪',
    levelCount: 11,
    xp: 55,
    displayedProgress: 30,
    visualFillRatio: 0.16896,
    gradient: gradients.categories.companions,
  },
  {
    id: 'ramadan',
    name: 'Ramadan',
    icon: '🎁',
    levelCount: 7,
    xp: 80,
    displayedProgress: 5,
    visualFillRatio: 0.02816,
    gradient: gradients.categories.ramadan,
  },
];

const categoryLevels: CategoryLevel[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    icon: '🌱',
    levelCount: 6,
    description: 'Start your journey!',
    stars: 1,
    gradient: gradients.categoryModal.beginner,
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    icon: '⚡',
    levelCount: 9,
    description: 'Rise to the challenge!',
    stars: 2,
    gradient: gradients.categoryModal.intermediate,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    icon: '🔥',
    levelCount: 12,
    description: 'For true champions!',
    stars: 3,
    gradient: gradients.categoryModal.advanced,
  },
];

export function useHomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const displayName = useAuthStore((state) => state.session?.user.displayName);
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(
    null,
  );
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const recentActivities: RecentActivity[] = [
    {
      id: 'stories-today',
      statusLabel: '✓ Completed',
      activityName: 'Hadeeth',
      xp: 40,
      day: 'Level 5',
      icon: createElement(NotificationBellIcon, { size: 20 }),
    },
    {
      id: 'quran-level-6',
      statusLabel: '✓ Completed',
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

  const handleSelectCategoryLevel = useCallback((level: CategoryLevel) => {
    // The destination flow has not been defined yet. Keeping this typed handler
    // makes that navigation addition local to the Home feature when it is ready.
    void level;
  }, []);

  return {
    displayName,
    recentActivities,
    categories,
    categoryLevels,
    selectedCategory,
    isCategoryModalVisible,
    openCategoryModal,
    finishClosingCategoryModal,
    handleSelectCategoryLevel,
    contentBottomPadding: tabBarHeight + 24,
  };
}
