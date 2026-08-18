/**
 * Leaderboard layout geometry.
 *
 * Every value below is expressed in the units of the 390 pt wide visual
 * reference. `getLeaderboardMetrics` scales them for the current viewport so a
 * single source of truth drives both the SVG podium and the React Native
 * layers that sit on top of it.
 */

import { PROFILE_AVATAR_ARTWORK_ASPECT_RATIO } from '@/constants/profile-avatars';

export const LEADERBOARD_REFERENCE_WIDTH = 390;
export const LEADERBOARD_MAX_CONTENT_WIDTH = 430;
export const LEADERBOARD_MAX_SCALE = 1.08;

/** Title block: 32 top offset + 29 title line + 5 gap + 15 subtitle + 4 gap. */
export const LEADERBOARD_HEADER_HEIGHT = 85;
export const LEADERBOARD_TITLE_TOP = 32;
export const LEADERBOARD_TITLE_LINE_HEIGHT = 29;
export const LEADERBOARD_SUBTITLE_GAP = 5;
export const LEADERBOARD_SUBTITLE_LINE_HEIGHT = 15;
export const LEADERBOARD_PODIUM_GAP = 4;

/** Podium geometry, where local y = 0 is the top of the podium section. */
export const PODIUM_REFERENCE_HEIGHT = 365;
export const PODIUM_BLOCK_INSET = 45;
export const PODIUM_BLOCK_WIDTH = 100;
export const PODIUM_CENTER_BLOCK_TOP = 141;
export const PODIUM_SIDE_BLOCK_TOP = 187;
export const PODIUM_BLOCK_BOTTOM = 324;
export const PODIUM_SIDE_TOP_SLANT = 18;
export const PODIUM_SIDE_TOP_THICKNESS = 30;
export const PODIUM_EDGE_HIGHLIGHT = 3;
export const PODIUM_CENTER_NUMBER_OFFSET = 106;
export const PODIUM_SIDE_NUMBER_OFFSET = 71;
export const PODIUM_MARK_OFFSET = 30;
export const PODIUM_MARK_HALF_WIDTH = 13;
export const PODIUM_MARK_DEPTH = 11;
export const PODIUM_NUMBER_FONT_SIZE = 29;

/** Podium identity stack, measured upwards from the top of each block. */
export const PODIUM_FIRST_AVATAR_SIZE = 56;
export const PODIUM_SIDE_AVATAR_SIZE = 53;
export const PODIUM_CROWN_WIDTH = 30;
export const PODIUM_CROWN_HEIGHT = 24;
export const PODIUM_CROWN_GAP = 2;
export const PODIUM_IDENTITY_GAP = 2;
export const PODIUM_NAME_FONT_SIZE = 12;
export const PODIUM_NAME_LINE_HEIGHT = 14;
export const PODIUM_SCORE_FONT_SIZE = 9;
export const PODIUM_SCORE_PILL_HEIGHT = 14;
export const PODIUM_FIRST_BOTTOM_GAP = 2;
export const PODIUM_SIDE_BOTTOM_GAP = 9;

/** Ranked list surface. */
export const LEADERBOARD_LIST_RADIUS = 30;
export const LEADERBOARD_LIST_TOP_PADDING = 22;
export const LEADERBOARD_ROW_INSET = 32;
export const LEADERBOARD_ROW_HEIGHT = 56;
export const LEADERBOARD_ROW_GAP = 10;
export const LEADERBOARD_ROW_RADIUS = 28;
export const LEADERBOARD_ROW_AVATAR_SIZE = 42;
export const LEADERBOARD_RANK_PILL_WIDTH = 46;
export const LEADERBOARD_RANK_PILL_HEIGHT = 22;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function getLeaderboardMetrics(windowWidth: number) {
  const contentWidth = Math.min(
    Math.max(windowWidth, 1),
    LEADERBOARD_MAX_CONTENT_WIDTH,
  );
  const podiumScale = Math.min(
    LEADERBOARD_MAX_SCALE,
    contentWidth / LEADERBOARD_REFERENCE_WIDTH,
  );
  // Artwork and type shrink far less than the podium so narrow phones stay
  // readable instead of scaling everything down uniformly.
  const avatarScale = clamp(podiumScale, 0.85, 1);
  const textScale = clamp(podiumScale, 0.92, 1);

  const podiumWidth = LEADERBOARD_REFERENCE_WIDTH * podiumScale;
  const podiumArtHeight = PODIUM_REFERENCE_HEIGHT * podiumScale;
  const blockWidth = PODIUM_BLOCK_WIDTH * podiumScale;
  const centerBlockTop = PODIUM_CENTER_BLOCK_TOP * podiumScale;
  const sideBlockTop = PODIUM_SIDE_BLOCK_TOP * podiumScale;

  const firstAvatarSize = Math.round(PODIUM_FIRST_AVATAR_SIZE * avatarScale);
  const sideAvatarSize = Math.round(PODIUM_SIDE_AVATAR_SIZE * avatarScale);
  const crownWidth = Math.round(PODIUM_CROWN_WIDTH * avatarScale);
  const crownHeight = Math.round(PODIUM_CROWN_HEIGHT * avatarScale);
  const nameFontSize = PODIUM_NAME_FONT_SIZE * textScale;
  const nameLineHeight = PODIUM_NAME_LINE_HEIGHT * textScale;
  const scoreFontSize = PODIUM_SCORE_FONT_SIZE * textScale;
  const scorePillHeight = PODIUM_SCORE_PILL_HEIGHT * textScale;
  const numberFontSize = PODIUM_NUMBER_FONT_SIZE * textScale;

  const identityTail =
    PODIUM_IDENTITY_GAP +
    nameLineHeight +
    PODIUM_IDENTITY_GAP +
    scorePillHeight;
  const firstIdentityHeight =
    crownHeight +
    PODIUM_CROWN_GAP +
    getAvatarBoxHeight(firstAvatarSize) +
    identityTail +
    PODIUM_FIRST_BOTTOM_GAP;
  const sideIdentityHeight =
    getAvatarBoxHeight(sideAvatarSize) + identityTail + PODIUM_SIDE_BOTTOM_GAP;

  // Nothing may be clipped on short or narrow devices: when an identity stack
  // no longer fits above its block, the whole podium is pushed down instead.
  const podiumOverflow = Math.max(
    0,
    firstIdentityHeight - centerBlockTop,
    sideIdentityHeight - sideBlockTop,
  );
  const podiumSectionHeight = podiumOverflow + podiumArtHeight;

  const rowInset = clamp(
    Math.round(
      (contentWidth * LEADERBOARD_ROW_INSET) / LEADERBOARD_REFERENCE_WIDTH,
    ),
    16,
    36,
  );

  return {
    contentWidth,
    podiumScale,
    podiumWidth,
    podiumArtHeight,
    podiumOverflow,
    podiumSectionHeight,
    blockWidth,
    centerBlockTop,
    sideBlockTop,
    firstAvatarSize,
    sideAvatarSize,
    crownWidth,
    crownHeight,
    nameFontSize,
    nameLineHeight,
    scoreFontSize,
    scorePillHeight,
    numberFontSize,
    rowInset,
    rowWidth: contentWidth - rowInset * 2,
    listSurfaceTop: LEADERBOARD_HEADER_HEIGHT + podiumSectionHeight,
  };
}

export type LeaderboardMetrics = ReturnType<typeof getLeaderboardMetrics>;

/**
 * Avatar artwork is taller than its circular backdrop, so a box that keeps the
 * character unstretched is taller than the circle it renders.
 */
export function getAvatarBoxHeight(size: number) {
  return size / PROFILE_AVATAR_ARTWORK_ASPECT_RATIO;
}
