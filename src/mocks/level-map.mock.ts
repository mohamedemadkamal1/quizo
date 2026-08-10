import type { CategoryId } from '@/types/home.types';
import type {
  LevelMapDifficulty,
  LevelMapResponse,
  LevelStatus,
} from '@/types/level-map.types';

const MOCK_TOTAL_LEVELS = 100;
const MOCK_CURRENT_LEVEL = 6;

function getMockLevelStatus(levelNumber: number): LevelStatus {
  if (levelNumber < MOCK_CURRENT_LEVEL) {
    return 'completed';
  }

  return levelNumber === MOCK_CURRENT_LEVEL ? 'current' : 'locked';
}

export function createMockLevelMapResponse(
  categoryId: CategoryId,
  difficulty: LevelMapDifficulty,
): LevelMapResponse {
  return {
    categoryId,
    difficulty,
    totalLevels: MOCK_TOTAL_LEVELS,
    levels: Array.from({ length: MOCK_TOTAL_LEVELS }, (_, index) => {
      const number = index + 1;

      return {
        id: `${categoryId}-${difficulty}-${number}`,
        number,
        title: `Level ${number}`,
        xp: 20 + number * 5,
        status: getMockLevelStatus(number),
      };
    }),
  };
}

