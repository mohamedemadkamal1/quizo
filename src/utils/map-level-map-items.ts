import type {
  LevelMapLevel,
  ValidatedLevelMapItem,
} from '@/types/level-map.types';
import {
  isLevelStatus,
  normalizeLevelStatus,
} from '@/utils/level-map-status';

export function mapLevelMapItems(
  items: readonly ValidatedLevelMapItem[],
): LevelMapLevel[] {
  return items
    .slice()
    .sort((first, second) => first.order - second.order)
    .map((item, positionIndex) => {
      const normalizedState = isLevelStatus(item.status)
        ? normalizeLevelStatus(item.status)
        : 'locked';
      const hasRecognizedStatus = isLevelStatus(item.status);
      const viewState = item.published ? normalizedState : 'locked';
      const isPlayable =
        item.published &&
        hasRecognizedStatus &&
        (viewState === 'available' ||
          (viewState === 'in-progress' &&
            item.activeSessionId !== null &&
            Number.isInteger(item.activeSessionId) &&
            item.activeSessionId > 0));

      return {
        id: item.id,
        number: item.order,
        positionIndex,
        title: `Level ${item.order}`,
        viewState,
        isPlayable,
        hasRecognizedStatus,
        isBoss: item.isBoss,
        published: item.published,
        questionsCount: item.questionsCount,
        activeSessionId: item.activeSessionId,
      };
    });
}
