import {
  LEVEL_MAP_DECORATIONS,
  type LevelMapDecorationDefinition,
  type LevelMapDecorationPlacement,
  type LevelMapDecorationSide,
} from '@/constants/level-map-decorations';
import { getLevelNodePosition } from '@/constants/level-map';
import type {
  LevelMapDifficulty,
  LevelMapLevel,
  LevelMapTheme,
} from '@/types/level-map.types';

type CreateLevelMapDecorationPlanParams = {
  subCategoryId: number;
  difficulty: LevelMapDifficulty;
  orderedLevels: readonly LevelMapLevel[];
  theme: LevelMapTheme;
};

function hashSeed(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], random: () => number) {
  const shuffled = values.slice();

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getPreferredSide(
  level: LevelMapLevel,
  theme: LevelMapTheme,
  sideCounts: Record<LevelMapDecorationSide, number>,
  random: () => number,
): LevelMapDecorationSide {
  const normalizedNodeX = getLevelNodePosition(theme, level.positionIndex + 1);

  if (normalizedNodeX < 0.43) {
    return 'right';
  }

  if (normalizedNodeX > 0.57) {
    return 'left';
  }

  if (sideCounts.left !== sideCounts.right) {
    return sideCounts.left < sideCounts.right ? 'left' : 'right';
  }

  return random() < 0.5 ? 'left' : 'right';
}

function selectRows(
  orderedLevels: readonly LevelMapLevel[],
  targetCount: number,
  random: () => number,
) {
  const eligibleLevels = orderedLevels.filter(
    (level) => Math.abs(level.positionIndex - 1) > 1,
  );
  const evenRows = eligibleLevels.filter(
    (level) => level.positionIndex % 2 === 0,
  );
  const oddRows = eligibleLevels.filter(
    (level) => level.positionIndex % 2 !== 0,
  );
  const preferredRows =
    evenRows.length === oddRows.length
      ? random() < 0.5
        ? evenRows
        : oddRows
      : evenRows.length > oddRows.length
        ? evenRows
        : oddRows;

  return shuffle(preferredRows, random).slice(0, targetCount);
}

export function createLevelMapDecorationPlan({
  subCategoryId,
  difficulty,
  orderedLevels,
  theme,
}: CreateLevelMapDecorationPlanParams): ReadonlyMap<
  number,
  LevelMapDecorationPlacement
> {
  const identity = `${subCategoryId}:${difficulty}:${orderedLevels
    .map((level) => level.id)
    .join(',')}`;
  const random = createSeededRandom(hashSeed(identity));
  const targetCount = Math.min(
    LEVEL_MAP_DECORATIONS.length,
    5,
    Math.max(1, Math.floor(orderedLevels.length / 3) + 1),
  );
  const selectedRows = selectRows(orderedLevels, targetCount, random);
  const decorations = shuffle<LevelMapDecorationDefinition>(
    LEVEL_MAP_DECORATIONS,
    random,
  );
  const sideCounts: Record<LevelMapDecorationSide, number> = {
    left: 0,
    right: 0,
  };
  const placements = new Map<number, LevelMapDecorationPlacement>();

  selectedRows.forEach((level, index) => {
    const side = getPreferredSide(level, theme, sideCounts, random);
    sideCounts[side] += 1;
    placements.set(level.id, {
      levelId: level.id,
      decoration: decorations[index],
      side,
      verticalOffset: Math.round(random() * 12 - 6),
    });
  });

  return placements;
}
