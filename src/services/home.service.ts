import { apiClient } from '@/services/api/api-client';
import type { HomeApiResponse, HomeData, HomeItem } from '@/types/home.types';

export const HOME_QUERY_KEY = ['home'] as const;

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
    typeof item.color === 'string' &&
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
