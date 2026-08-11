import { isLevelMapDifficulty } from '@/constants/level-map';
import { apiClient } from '@/services/api/api-client';
import type {
  GetLevelMapParams,
  LevelMapProgressDto,
  PaginationMeta,
  ValidatedLevelMapData,
  ValidatedLevelMapItem,
} from '@/types/level-map.types';
import { isLevelStatus } from '@/utils/level-map-status';

export const LEVEL_MAP_PAGE = 1;
export const LEVEL_MAP_LIMIT = 15;

export function getLevelMapQueryKey(params: GetLevelMapParams) {
  return [
    'level-map',
    {
      subCategoryId: params.subCategoryId,
      stage: params.stage,
      page: params.page ?? LEVEL_MAP_PAGE,
      limit: params.limit ?? LEVEL_MAP_LIMIT,
    },
  ] as const;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPositiveInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0;
}

function isValidSessionId(value: unknown): value is number | null {
  return value === null || isPositiveInteger(value);
}

function parseLevelMapItem(
  value: unknown,
  requestedStage: GetLevelMapParams['stage'],
): ValidatedLevelMapItem {
  if (!isRecord(value)) {
    throw new Error('The level-map response contains an invalid level.');
  }

  const {
    id,
    order,
    stage,
    isBoss,
    published,
    questionsCount,
    status,
    activeSessionId,
  } = value;

  if (
    !isPositiveInteger(id) ||
    !isPositiveInteger(order) ||
    !isLevelMapDifficulty(stage) ||
    stage !== requestedStage ||
    typeof isBoss !== 'boolean' ||
    typeof published !== 'boolean' ||
    !isNonNegativeInteger(questionsCount) ||
    typeof status !== 'string' ||
    status.trim().length === 0 ||
    !isValidSessionId(activeSessionId)
  ) {
    throw new Error('The level-map response contains an invalid level.');
  }

  return {
    id,
    order,
    stage,
    isBoss,
    published,
    questionsCount,
    status,
    activeSessionId,
    hasRecognizedStatus: isLevelStatus(status),
  };
}

function parsePaginationMeta(value: unknown): PaginationMeta {
  if (!isRecord(value)) {
    throw new Error('The level-map response has invalid pagination metadata.');
  }

  const {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = value;

  if (
    !isNonNegativeInteger(total) ||
    !isPositiveInteger(page) ||
    !isPositiveInteger(limit) ||
    !isNonNegativeInteger(totalPages) ||
    typeof hasNextPage !== 'boolean' ||
    typeof hasPrevPage !== 'boolean'
  ) {
    throw new Error('The level-map response has invalid pagination metadata.');
  }

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}

function parseLevelMapProgress(value: unknown): LevelMapProgressDto {
  if (!isRecord(value)) {
    throw new Error('The level-map response has invalid progress data.');
  }

  const { currentLevel, completedLevels, totalXp, lastPlayedAt } = value;
  const hasValidLastPlayedAt =
    lastPlayedAt === null ||
    (typeof lastPlayedAt === 'string' &&
      lastPlayedAt.trim().length > 0 &&
      !Number.isNaN(new Date(lastPlayedAt).getTime()));

  if (
    !isNonNegativeInteger(currentLevel) ||
    !isNonNegativeInteger(completedLevels) ||
    !isFiniteNumber(totalXp) ||
    totalXp < 0 ||
    !hasValidLastPlayedAt
  ) {
    throw new Error('The level-map response has invalid progress data.');
  }

  return {
    currentLevel,
    completedLevels,
    totalXp,
    lastPlayedAt,
  };
}

function parseLevelMapResponse(
  value: unknown,
  requestedStage: GetLevelMapParams['stage'],
): ValidatedLevelMapData {
  if (
    !isRecord(value) ||
    value.success !== true ||
    value.statusCode !== 200 ||
    !isRecord(value.data) ||
    !Array.isArray(value.data.items)
  ) {
    throw new Error('The level-map response is malformed.');
  }

  return {
    items: value.data.items.map((item) =>
      parseLevelMapItem(item, requestedStage),
    ),
    meta: parsePaginationMeta(value.data.meta),
    progress: parseLevelMapProgress(value.data.progress),
  };
}

export async function getLevelMap(
  params: GetLevelMapParams,
): Promise<ValidatedLevelMapData> {
  const { subCategoryId, stage, page, limit } = params;

  if (
    !isPositiveInteger(subCategoryId) ||
    !isLevelMapDifficulty(stage) ||
    (page !== undefined && !isPositiveInteger(page)) ||
    (limit !== undefined && !isPositiveInteger(limit))
  ) {
    throw new Error('Valid level-map request parameters are required.');
  }

  const response = await apiClient.get<unknown>('/home/map', {
    params: {
      subCategoryId,
      stage,
      ...(page === undefined ? {} : { page }),
      ...(limit === undefined ? {} : { limit }),
    },
  });

  return parseLevelMapResponse(response.data, stage);
}
