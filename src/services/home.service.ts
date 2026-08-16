import { apiClient } from '@/services/api/api-client';
import type {
  HomeApiResponse,
  HomeData,
  HomeItem,
  SubCategoryLevelCounts,
  SubCategoryLevelsApiResponse,
} from '@/types/home.types';

export const HOME_QUERY_KEY = ['home'] as const;

export function getSubCategoryLevelCountsQueryKey(subCatId: number | null) {
  return ['sub-categories', subCatId, 'level-counts'] as const;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isHomeItem(value: unknown): value is HomeItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    isFiniteNumber(item.id) &&
    Number.isInteger(item.id) &&
    item.id > 0 &&
    typeof item.name === 'string' &&
    isFiniteNumber(item.totalLevels) &&
    isFiniteNumber(item.currentLevel) &&
    isFiniteNumber(item.completedLevels) &&
    isFiniteNumber(item.totalXp) &&
    isFiniteNumber(item.totalCorrectAnswers) &&
    isFiniteNumber(item.totalWrongAnswers) &&
    (typeof item.lastPlayedAt === 'string' || item.lastPlayedAt === null) &&
    typeof item.isCompleted === 'boolean' &&
    isFiniteNumber(item.completedPercentage)
  );
}

function isValidLevelCount(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0;
}

function parseSubCategoryLevelCounts(value: unknown): SubCategoryLevelCounts {
  if (!value || typeof value !== 'object') {
    throw new Error('The difficulty response is malformed.');
  }

  const counts = value as Record<string, unknown>;

  if (
    !isValidLevelCount(counts.BEGINNER) ||
    !isValidLevelCount(counts.INTERMEDIATE) ||
    !isValidLevelCount(counts.ADVANCED)
  ) {
    throw new Error('The difficulty response is malformed.');
  }

  return {
    BEGINNER: counts.BEGINNER,
    INTERMEDIATE: counts.INTERMEDIATE,
    ADVANCED: counts.ADVANCED,
  };
}

export async function getHome(): Promise<HomeData> {
  const response = await apiClient.get<HomeApiResponse>('/home');

  const data = response.data?.data;

  if (!data?.meta) {
    throw new Error('The Home response is missing its data or metadata.');
  }

  return {
    items: Array.isArray(data.items) ? data.items.filter(isHomeItem) : [],
    meta: data.meta,
  };
}

export async function getSubCategoryLevelCounts(
  subCatId: number,
): Promise<SubCategoryLevelCounts> {
  if (!Number.isInteger(subCatId) || subCatId <= 0) {
    throw new Error('A valid subcategory ID is required.');
  }

  const response = await apiClient.get<SubCategoryLevelsApiResponse>(
    `/sub-categories/${subCatId}/levels`,
  );

  return parseSubCategoryLevelCounts(response.data?.data);
}
