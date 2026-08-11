import type { ReactNode } from 'react';

import type { ApiEnvelope } from '@/types/auth.types';

export type GradientColors = readonly [string, string];

export type SubCategoryId = number;

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type SubCategoryLevelCounts = Record<Difficulty, number>;

export type SubCategoryLevelsApiResponse =
  ApiEnvelope<SubCategoryLevelCounts> & {
    success: true;
    statusCode: 200;
  };

export type HomeItem = {
  id: number;
  color: string;
  name: string;
  totalLevels: number;
  currentLevel: number;
  completedLevels: number;
  totalXp: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  lastPlayedAt: string | null;
  isCompleted: boolean;
  completedPercentage: number;
};

export type HomeMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type HomeData = {
  items: HomeItem[];
  meta: HomeMeta;
};

export type HomeApiResponse = ApiEnvelope<HomeData> & {
  success: true;
  statusCode: 200;
};

export type HomeCategory = {
  id: number;
  name: string;
  icon: string;
  levelCount: number;
  xp: number;
  displayedProgress: number;
  visualFillRatio: number;
  gradient: GradientColors;
};

export type CategoryLevelStarCount = 1 | 2 | 3;

export type CategoryLevelConfig = {
  difficulty: Difficulty;
  title: string;
  icon: string;
  description: string;
  stars: CategoryLevelStarCount;
  gradient: GradientColors;
};

export type CategoryLevel = CategoryLevelConfig & {
  levelCount: number;
};

export type RecentActivity = {
  id: number;
  icon: ReactNode;
  statusLabel: string;
  activityName: string;
  xp: number;
  day: string;
};
