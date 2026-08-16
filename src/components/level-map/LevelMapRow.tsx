import { Image, StyleSheet, Text, View } from 'react-native';

import { LevelMapDecoration } from '@/components/level-map/LevelMapDecoration';
import { LevelNode } from '@/components/level-map/LevelNode';
import { LevelPath } from '@/components/level-map/LevelPath';
import {
  getLevelNodePosition,
  LEVEL_MAP_ROW_HEIGHT,
} from '@/constants/level-map';
import type { LevelMapDecorationPlacement } from '@/constants/level-map-decorations';
import type { LevelMapLevel, LevelMapTheme } from '@/types/level-map.types';

type LevelMapRowProps = {
  level: LevelMapLevel;
  previousLevel: LevelMapLevel | null;
  nextLevel: LevelMapLevel | null;
  mapWidth: number;
  decoration: LevelMapDecorationPlacement | null;
  theme: LevelMapTheme;
  onPressLevel: (level: LevelMapLevel) => void;
};

function getConnectorColor(
  first: LevelMapLevel,
  second: LevelMapLevel,
  theme: LevelMapTheme,
) {
  return first.viewState === 'locked' || second.viewState === 'locked'
    ? theme.lockedConnectorColor
    : theme.connectorColor;
}

function getNodeX(
  level: LevelMapLevel,
  mapWidth: number,
  theme: LevelMapTheme,
) {
  const horizontalInset = 52;
  const normalizedX = getLevelNodePosition(theme, level.positionIndex + 1);
  return horizontalInset + normalizedX * (mapWidth - horizontalInset * 2);
}

export function LevelMapRow({
  level,
  previousLevel,
  nextLevel,
  mapWidth,
  decoration,
  theme,
  onPressLevel,
}: LevelMapRowProps) {
  const nodeX = getNodeX(level, mapWidth, theme);
  const previousNodeX = previousLevel
    ? getNodeX(previousLevel, mapWidth, theme)
    : null;
  const nextNodeX = nextLevel ? getNodeX(nextLevel, mapWidth, theme) : null;
  const connectorXs = [
    nodeX,
    ...(previousNodeX === null ? [] : [(previousNodeX + nodeX) / 2]),
    ...(nextNodeX === null ? [] : [(nodeX + nextNodeX) / 2]),
  ];
  const pathLeft = Math.min(...connectorXs);
  const pathRight = Math.max(...connectorXs);
  const nodeSafetyInset = 60;
  const pathSafetyInset = 14;
  const edgeInset = 14;
  const leftCorridorWidth =
    Math.min(nodeX - nodeSafetyInset, pathLeft - pathSafetyInset) - edgeInset;
  const rightCorridorWidth =
    mapWidth -
    edgeInset -
    Math.max(nodeX + nodeSafetyInset, pathRight + pathSafetyInset);
  const showMascot = level.positionIndex === 1;
  const showSparkle = (level.positionIndex + 1) % 3 === 0;

  return (
    <View style={styles.row}>
      <LevelPath
        width={mapWidth}
        height={LEVEL_MAP_ROW_HEIGHT}
        nodeX={nodeX}
        previousNodeX={previousNodeX}
        nextNodeX={nextNodeX}
        previousColor={
          previousLevel
            ? getConnectorColor(previousLevel, level, theme)
            : theme.connectorColor
        }
        nextColor={
          nextLevel
            ? getConnectorColor(level, nextLevel, theme)
            : theme.connectorColor
        }
      />

      {decoration ? (
        <LevelMapDecoration
          leftCorridorWidth={leftCorridorWidth}
          mapWidth={mapWidth}
          placement={decoration}
          rightCorridorWidth={rightCorridorWidth}
        />
      ) : null}

      {showSparkle ? (
        <Text
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.sparkle,
            (level.positionIndex + 1) % 2 === 0
              ? styles.sparkleLeft
              : styles.sparkleRight,
          ]}
        >
          {'\u2726'}
        </Text>
      ) : null}

      {showMascot ? (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.mascotContainer,
            theme.mascotSide === 'left'
              ? styles.mascotLeft
              : styles.mascotRight,
          ]}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={theme.mascotSource}
            style={styles.mascot}
          />
        </View>
      ) : null}

      <View
        style={[
          styles.nodePosition,
          { left: nodeX - styles.nodePosition.width / 2 },
        ]}
      >
        <LevelNode level={level} theme={theme} onPress={onPressLevel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: LEVEL_MAP_ROW_HEIGHT,
    overflow: 'visible',
  },
  nodePosition: {
    position: 'absolute',
    top: (LEVEL_MAP_ROW_HEIGHT - 100) / 2,
    width: 92,
    height: 100,
    zIndex: 3,
  },
  sparkle: {
    position: 'absolute',
    zIndex: 1,
    fontSize: 24,
    color: '#FFFFFF',
    opacity: 0.92,
  },
  sparkleLeft: {
    top: 14,
    left: 28,
  },
  sparkleRight: {
    right: 30,
    bottom: 14,
  },
  mascotContainer: {
    position: 'absolute',
    bottom: -54,
    zIndex: 2,
    width: 132,
    height: 232,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  mascotLeft: {
    left: 6,
  },
  mascotRight: {
    right: 6,
  },
});
