import type { ImageSourcePropType } from 'react-native';

import type { AvatarId } from '@/types/avatar.types';
import type { HomeMeta } from '@/types/home.types';

export type LeaderboardMeta = HomeMeta;

/**
 * A leaderboard row after service-boundary validation.
 *
 * The backend also returns an `email`, which is validated and then dropped
 * here: it must never reach the hook, the components, or an accessibility
 * label.
 */
export type LeaderboardItemDto = {
  id: number;
  username: string | null;
  totalScore: number;
  avatar: AvatarId | null;
};

export type LeaderboardPage = {
  items: LeaderboardItemDto[];
  meta: LeaderboardMeta;
};

export type GetLeaderboardParams = {
  page: number;
  limit: number;
};

/** The UI-safe model: no email, no envelope, no pagination metadata. */
export type LeaderboardEntry = {
  id: number;
  displayName: string;
  totalScore: number;
  avatar: AvatarId | null;
};

/** A UI-safe entry with its server-derived rank and presentation helpers. */
export type LeaderboardRankedEntry = LeaderboardEntry & {
  rank: number;
  initials: string;
  avatarSource: ImageSourcePropType | null;
  accessibilityLabel: string;
};

export type LeaderboardPodiumPlace = 1 | 2 | 3;

export type LeaderboardPodiumEntry = LeaderboardRankedEntry & {
  place: LeaderboardPodiumPlace;
};
