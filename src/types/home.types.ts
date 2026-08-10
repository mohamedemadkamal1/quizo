import type { ReactNode } from 'react';

export type GradientColors = readonly [string, string];

export type CategoryId =
  | 'quran'
  | 'seerah'
  | 'duas'
  | 'prophets'
  | 'good-manners'
  | 'islamic-quiz'
  | 'companions'
  | 'ramadan';

export type HomeCategory = {
  id: CategoryId;
  name: string;
  icon: string;
  levelCount: number;
  xp: number;
  displayedProgress: number;
  visualFillRatio: number;
  gradient: GradientColors;
};

export type CategoryLevelId = 'beginner' | 'intermediate' | 'advanced';

export type CategoryLevelStarCount = 1 | 2 | 3;

export type CategoryLevel = {
  id: CategoryLevelId;
  title: string;
  icon: string;
  levelCount: number;
  description: string;
  stars: CategoryLevelStarCount;
  gradient: GradientColors;
};

export type RecentActivity = {
  id: string;
  icon: ReactNode;
  statusLabel: string;
  activityName: string;
  xp: number;
  day: string;
};
