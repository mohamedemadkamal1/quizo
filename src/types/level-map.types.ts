import type { ImageSourcePropType } from 'react-native';

import type { ApiEnvelope } from '@/types/auth.types';
import type {
  Difficulty,
  HomeMeta,
  SubCategoryId,
} from '@/types/home.types';

export type Stage = Difficulty;
export type LevelMapDifficulty = Stage;
export type PaginationMeta = HomeMeta;

export type LevelStatus =
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'AVAILABLE'
  | 'LOCKED';

export type LevelNodeViewState =
  | 'in-progress'
  | 'completed'
  | 'available'
  | 'locked';

export type LevelMapItemDto = {
  id: number;
  order: number;
  stage: Stage;
  isBoss: boolean;
  published: boolean;
  questionsCount: number;
  status: LevelStatus;
  activeSessionId: number | null;
};

export type LevelMapProgressDto = {
  currentLevel: number;
  completedLevels: number;
  totalXp: number;
  lastPlayedAt: string | null;
};

export type LevelMapData = {
  items: LevelMapItemDto[];
  meta: PaginationMeta;
  progress: LevelMapProgressDto;
};

export type LevelMapApiResponse = ApiEnvelope<LevelMapData> & {
  success: true;
  statusCode: 200;
};

export type ValidatedLevelMapItem = Omit<LevelMapItemDto, 'status'> & {
  status: string;
  hasRecognizedStatus: boolean;
};

export type ValidatedLevelMapData = Omit<LevelMapData, 'items'> & {
  items: ValidatedLevelMapItem[];
};

export type GetLevelMapParams = {
  subCategoryId: SubCategoryId;
  stage: Stage;
  page?: number;
  limit?: number;
};

export type LevelMapCategory = {
  id: SubCategoryId;
  name: string;
  icon: string;
};

export type LevelMapLevel = {
  id: number;
  number: number;
  positionIndex: number;
  title: string;
  viewState: LevelNodeViewState;
  isPlayable: boolean;
  hasRecognizedStatus: boolean;
  isBoss: boolean;
  published: boolean;
  questionsCount: number;
  activeSessionId: number | null;
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
