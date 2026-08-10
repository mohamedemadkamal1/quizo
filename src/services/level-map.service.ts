import { createMockLevelMapResponse } from '@/mocks/level-map.mock';
import type { CategoryId } from '@/types/home.types';
import type {
  LevelMapDifficulty,
  LevelMapResponse,
} from '@/types/level-map.types';

export async function getLevelMap(
  categoryId: CategoryId,
  difficulty: LevelMapDifficulty,
): Promise<LevelMapResponse> {
  // Replace this mock boundary with the real API request when its endpoint is
  // available. Callers already consume the backend-shaped response.
  return createMockLevelMapResponse(categoryId, difficulty);
}

