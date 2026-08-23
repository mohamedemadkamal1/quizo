import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { LEVEL_MAP_NODE_SIZE } from '@/constants/level-map';
import { useTranslation } from '@/hooks/useTranslation';
import type { Translate, TranslationKey } from '@/i18n';
import type { LevelMapLevel, LevelMapTheme } from '@/types/level-map.types';

type LevelNodeProps = {
  level: LevelMapLevel;
  theme: LevelMapTheme;
  onPress: (level: LevelMapLevel) => void;
};

function getAccessibilityLabelKey(level: LevelMapLevel): TranslationKey {
  if (!level.published || !level.hasRecognizedStatus) {
    return 'levelMap.node.unavailable';
  }

  if (level.viewState === 'locked') {
    return 'levelMap.node.locked';
  }

  if (level.viewState === 'completed') {
    return level.isPlayable
      ? 'levelMap.node.completedReplayable'
      : 'levelMap.node.completed';
  }

  if (level.viewState === 'in-progress') {
    return level.isPlayable
      ? 'levelMap.node.inProgressResumable'
      : 'levelMap.node.inProgressUnavailable';
  }

  return 'levelMap.node.available';
}

function getAccessibilityLabel(level: LevelMapLevel, t: Translate) {
  return t(getAccessibilityLabelKey(level), { number: level.number });
}

export function LevelNode({ level, theme, onPress }: LevelNodeProps) {
  const { t } = useTranslation();
  const isPlayableState =
    level.viewState === 'in-progress' || level.viewState === 'available';
  const isCompleted = level.viewState === 'completed';
  const isLocked = level.viewState === 'locked';
  const isDisabled = !level.isPlayable;

  return (
    <Pressable
      accessibilityLabel={getAccessibilityLabel(level, t)}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => onPress(level)}
      style={styles.pressable}
    >
      <View
        style={[
          styles.node,
          isCompleted && {
            backgroundColor: theme.completedColor,
            borderColor: '#FFFFFF',
          },
          isPlayableState && {
            backgroundColor: theme.currentColor,
            borderColor: '#FFFFFF',
          },
          isLocked && {
            backgroundColor: theme.lockedFillColor,
            borderColor: theme.lockedBorderColor,
          },
        ]}
      >
        <AppText style={[styles.nodeText, isLocked && styles.lockedText]}>
          {isCompleted ? '✓' : isLocked ? '\u{1F512}' : level.number}
        </AppText>
      </View>

      {level.isPlayable ? (
        <View style={[styles.playPill, { backgroundColor: theme.playColor }]}>
          {/*
            The play triangle is a media control rather than a directional
            affordance, so it keeps pointing the same way in both languages;
            only the label beside it is translated.
          */}
          <AppText numberOfLines={1} style={styles.playText}>
            {'▶'} {t('levelMap.play')}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 92,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  node: {
    width: LEVEL_MAP_NODE_SIZE,
    height: LEVEL_MAP_NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: LEVEL_MAP_NODE_SIZE / 2,
    shadowColor: '#16213E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 7,
  },
  nodeText: {
    fontFamily: 'Fredoka',
    fontSize: 27,
    fontWeight: '500',
    lineHeight: 34,
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
  },
  lockedText: {
    fontSize: 21,
    opacity: 0.56,
  },
  playPill: {
    minWidth: 60,
    maxWidth: 92,
    height: 22,
    marginTop: -3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    paddingHorizontal: 9,
  },
  playText: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
