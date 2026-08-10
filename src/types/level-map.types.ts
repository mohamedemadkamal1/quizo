import type { ImageSourcePropType } from 'react-native';

import type { CategoryId, CategoryLevelId } from '@/types/home.types';

export type LevelMapDifficulty = CategoryLevelId;

export type LevelStatus = 'completed' | 'current' | 'locked';

export type LevelMapLevel = {
  id: string;
  number: number;
  title: string;
  xp: number;
  status: LevelStatus;
};

export type LevelMapResponse = {
  categoryId: CategoryId;
  difficulty: LevelMapDifficulty;
  totalLevels: number;
  levels: LevelMapLevel[];
};

export type VisibleLevelMap = {
  visibleLevels: LevelMapLevel[];
  currentLevel: LevelMapLevel | null;
  hasHiddenLevels: boolean;
  hiddenLevelCount: number;
};

export type LevelMapTheme = {
  difficulty: LevelMapDifficulty;
  label: string;
  icon: string;
  stars: 1 | 2 | 3;
  backgroundColors: readonly [string, string, string];
  backgroundLocations: readonly [number, number, number];
  headerColor: string;
  chipColor: string;
  completedColor: string;
  currentColor: string;
  playColor: string;
  connectorColor: string;
  lockedConnectorColor: string;
  lockedFillColor: string;
  lockedBorderColor: string;
  fogColors: readonly [string, string, string];
  positionPattern: readonly number[];
  mascotSource: ImageSourcePropType;
  mascotSide: 'left' | 'right';
};

