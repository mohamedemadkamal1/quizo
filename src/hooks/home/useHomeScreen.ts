import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { createElement } from 'react';

import { NotificationBellIcon } from '@/components/common/icons/NotificationBellIcon';
import { useAuthStore } from '@/store/auth.store';
import type { RecentActivity } from '@/types/home.types';

export function useHomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const displayName = useAuthStore((state) => state.session?.user.displayName);

  const recentActivities: RecentActivity[] = [
    {
      id: 'stories-today',
      statusLabel: 'âœ“ Completed',
      activityName: 'Hadeeth',
      xp: 40,
      day: 'Level 5',
      icon: createElement(NotificationBellIcon, { size: 20 }),
    },
    {
      id: 'quran-level-6',
      statusLabel: 'âœ“ Completed',
      activityName: 'Quran',
      xp: 50,
      day: 'Level 6',
      icon: createElement(NotificationBellIcon, { size: 20 }),
    },
  ];

  return {
    displayName,
    recentActivities,
    contentBottomPadding: tabBarHeight + 24,
  };
}
