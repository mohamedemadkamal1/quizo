import type {
  LevelMapLevel,
  VisibleLevelMap,
} from '@/types/level-map.types';

export class InvalidLevelMapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidLevelMapError';
  }
}

function validateLevelSequence(levels: readonly LevelMapLevel[]) {
  let currentCount = 0;
  let reachedCurrent = false;
  let reachedLocked = false;

  levels.forEach((level, index) => {
    const expectedNumber = index + 1;

    if (level.number !== expectedNumber) {
      throw new InvalidLevelMapError(
        `Expected level ${expectedNumber}, received ${level.number}.`,
      );
    }

    if (level.status === 'completed') {
      if (reachedCurrent || reachedLocked) {
        throw new InvalidLevelMapError(
          `Completed level ${level.number} appears after current or locked progress.`,
        );
      }
      return;
    }

    if (level.status === 'current') {
      currentCount += 1;
      if (currentCount > 1 || reachedLocked) {
        throw new InvalidLevelMapError('The map contains multiple current levels.');
      }
      reachedCurrent = true;
      return;
    }

    reachedLocked = true;
    if (!reachedCurrent) {
      throw new InvalidLevelMapError(
        `Locked level ${level.number} appears before the current level.`,
      );
    }
  });

  if (levels.length > 0 && currentCount === 0 && !levels.every((level) => level.status === 'completed')) {
    throw new InvalidLevelMapError(
      'A non-complete map must contain exactly one current level.',
    );
  }
}

export function deriveVisibleLevelMap(
  levels: readonly LevelMapLevel[],
  lockedPreviewCount: number,
): VisibleLevelMap {
  if (!Number.isInteger(lockedPreviewCount) || lockedPreviewCount < 0) {
    throw new InvalidLevelMapError(
      'The locked preview count must be a non-negative integer.',
    );
  }

  validateLevelSequence(levels);

  const currentIndex = levels.findIndex((level) => level.status === 'current');
  if (currentIndex === -1) {
    return {
      visibleLevels: levels.slice(),
      currentLevel: null,
      hasHiddenLevels: false,
      hiddenLevelCount: 0,
    };
  }

  const visibleEndIndex = Math.min(
    levels.length,
    currentIndex + lockedPreviewCount + 1,
  );
  const visibleLevels = levels.slice(0, visibleEndIndex);

  return {
    visibleLevels,
    currentLevel: levels[currentIndex],
    hasHiddenLevels: visibleEndIndex < levels.length,
    hiddenLevelCount: levels.length - visibleEndIndex,
  };
}
