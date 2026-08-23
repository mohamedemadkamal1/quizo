import { apiClient } from '@/services/api/api-client';
import type { AppLanguage } from '@/i18n';
import { isAvatarId } from '@/types/avatar.types';
import type {
  GetLeaderboardParams,
  LeaderboardItemDto,
  LeaderboardMeta,
  LeaderboardPage,
} from '@/types/leaderboard.types';

export const LEADERBOARD_FIRST_PAGE = 1;
export const LEADERBOARD_LIMIT = 10;

export function getLeaderboardQueryKey(
  userId: string | undefined,
  language: AppLanguage,
) {
  return ['leaderboard', language, userId ?? null, LEADERBOARD_LIMIT] as const;
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

function parseLeaderboardMeta(value: unknown): LeaderboardMeta {
  if (!isRecord(value)) {
    throw new Error('The leaderboard response is missing its metadata.');
  }

  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = value;

  if (
    !isNonNegativeInteger(total) ||
    !isPositiveInteger(page) ||
    !isPositiveInteger(limit) ||
    !isNonNegativeInteger(totalPages) ||
    typeof hasNextPage !== 'boolean' ||
    typeof hasPrevPage !== 'boolean'
  ) {
    throw new Error('The leaderboard response contains invalid metadata.');
  }

  return { total, page, limit, totalPages, hasNextPage, hasPrevPage };
}

/**
 * `avatar` must be a supported identifier or `null` whenever the backend sends
 * it, so an unrecognised key is rejected as malformed rather than silently
 * swapped for someone else's artwork.
 *
 * The deployed endpoint currently omits the key entirely on every row, so an
 * absent field is read as "no avatar" instead of failing the whole screen.
 */
function parseAvatar(item: Record<string, unknown>) {
  if (!('avatar' in item)) {
    return null;
  }

  const { avatar } = item;

  if (avatar === null || isAvatarId(avatar)) {
    return avatar;
  }

  throw new Error('The leaderboard response contains an unknown avatar.');
}

function parseLeaderboardItem(value: unknown): LeaderboardItemDto {
  if (!isRecord(value)) {
    throw new Error('The leaderboard response contains an invalid entry.');
  }

  const { id, username, email, totalScore } = value;

  if (
    !isPositiveInteger(id) ||
    (typeof username !== 'string' && username !== null) ||
    !isFiniteNumber(totalScore) ||
    totalScore < 0
  ) {
    throw new Error('The leaderboard response contains an invalid entry.');
  }

  if ('email' in value && typeof email !== 'string' && email !== null) {
    throw new Error('The leaderboard response contains an invalid entry.');
  }

  // `email` is validated above and then deliberately dropped: nothing past
  // this function ever receives it.
  return {
    id,
    username,
    totalScore,
    avatar: parseAvatar(value),
  };
}

function parseLeaderboardResponse(value: unknown): LeaderboardPage {
  if (
    !isRecord(value) ||
    value.success !== true ||
    value.statusCode !== 200 ||
    !isRecord(value.data)
  ) {
    throw new Error('The leaderboard response is malformed.');
  }

  const { items, meta } = value.data;

  if (!Array.isArray(items)) {
    throw new Error('The leaderboard response is missing its entries.');
  }

  return {
    items: items.map(parseLeaderboardItem),
    meta: parseLeaderboardMeta(meta),
  };
}

/**
 * The configured API client already resolves to `<server>/api`, so the path
 * below is `/users/leaderboard` and the request lands on
 * `/api/users/leaderboard`. The client's request interceptor attaches the
 * Quizo access token.
 */
export async function getLeaderboard(
  params: GetLeaderboardParams,
): Promise<LeaderboardPage> {
  if (!isPositiveInteger(params.page) || !isPositiveInteger(params.limit)) {
    throw new Error('A valid leaderboard page and limit are required.');
  }

  const response = await apiClient.get<unknown>('/users/leaderboard', {
    params: {
      page: params.page,
      limit: params.limit,
    },
  });

  return parseLeaderboardResponse(response.data);
}
