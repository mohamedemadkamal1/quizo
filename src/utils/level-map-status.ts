import type {
  LevelNodeViewState,
  LevelStatus,
} from '@/types/level-map.types';

const LEVEL_STATUSES: readonly LevelStatus[] = [
  'IN_PROGRESS',
  'COMPLETED',
  'AVAILABLE',
  'LOCKED',
];

export function isLevelStatus(value: unknown): value is LevelStatus {
  return (
    typeof value === 'string' &&
    LEVEL_STATUSES.some((status) => status === value)
  );
}

export const normalizeLevelStatus = (
  status: LevelStatus,
): LevelNodeViewState => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'in-progress';

    case 'COMPLETED':
      return 'completed';

    case 'AVAILABLE':
      return 'available';

    case 'LOCKED':
      return 'locked';
  }
};
