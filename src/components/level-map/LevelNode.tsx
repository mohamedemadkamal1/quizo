import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LEVEL_MAP_NODE_SIZE } from '@/constants/level-map';
import type {
  LevelMapLevel,
  LevelMapTheme,
} from '@/types/level-map.types';

type LevelNodeProps = {
  level: LevelMapLevel;
  theme: LevelMapTheme;
  onPress: (level: LevelMapLevel) => void;
};

function getAccessibilityLabel(level: LevelMapLevel) {
  if (level.status === 'locked') {
    return `Level ${level.number}, locked.`;
  }

  if (level.status === 'completed') {
    return `Level ${level.number}, completed.`;
  }

  return `Level ${level.number}, current. Play.`;
}

export function LevelNode({ level, theme, onPress }: LevelNodeProps) {
  const isCurrent = level.status === 'current';
  const isCompleted = level.status === 'completed';
  const isDisabled = !isCurrent;

  return (
    <Pressable
      accessibilityLabel={getAccessibilityLabel(level)}
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
          isCurrent && {
            backgroundColor: theme.currentColor,
            borderColor: '#FFFFFF',
          },
          level.status === 'locked' && {
            backgroundColor: theme.lockedFillColor,
            borderColor: theme.lockedBorderColor,
          },
        ]}
      >
        <Text
          style={[
            styles.nodeText,
            level.status === 'locked' && styles.lockedText,
          ]}
        >
          {isCompleted
            ? '\u2713'
            : level.status === 'locked'
              ? '\u{1F512}'
              : level.number}
        </Text>
      </View>

      {isCurrent ? (
        <View style={[styles.playPill, { backgroundColor: theme.playColor }]}>
          <Text style={styles.playText}>{'\u25B6'} Play</Text>
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
    includeFontPadding: false,
  },
  lockedText: {
    fontSize: 21,
    opacity: 0.56,
  },
  playPill: {
    minWidth: 60,
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
    includeFontPadding: false,
  },
});

