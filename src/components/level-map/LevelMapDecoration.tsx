import { Image, StyleSheet, View } from 'react-native';

import { LEVEL_MAP_ROW_HEIGHT } from '@/constants/level-map';
import type { LevelMapDecorationPlacement } from '@/constants/level-map-decorations';

const MAP_REFERENCE_WIDTH = 430;
const EDGE_INSET = 14;
const MIN_DECORATION_WIDTH = 58;
const MAX_DECORATION_HEIGHT = LEVEL_MAP_ROW_HEIGHT - 12;

type LevelMapDecorationProps = {
  placement: LevelMapDecorationPlacement;
  mapWidth: number;
  leftCorridorWidth: number;
  rightCorridorWidth: number;
};

export function LevelMapDecoration({
  placement,
  mapWidth,
  leftCorridorWidth,
  rightCorridorWidth,
}: LevelMapDecorationProps) {
  const { decoration, side, verticalOffset } = placement;
  const responsiveScale = Math.min(
    1.08,
    Math.max(0.82, mapWidth / MAP_REFERENCE_WIDTH),
  );
  const availableWidth =
    side === 'left' ? leftCorridorWidth : rightCorridorWidth;
  const width = Math.min(
    decoration.preferredWidth * responsiveScale,
    availableWidth,
    MAX_DECORATION_HEIGHT * decoration.aspectRatio,
  );

  if (width < MIN_DECORATION_WIDTH) {
    return null;
  }

  const height = width / decoration.aspectRatio;
  const centeredTop = (LEVEL_MAP_ROW_HEIGHT - height) / 2;
  const top = Math.max(
    6,
    Math.min(LEVEL_MAP_ROW_HEIGHT - height - 6, centeredTop + verticalOffset),
  );

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.container,
        {
          top,
          width,
          height,
          [side]: EDGE_INSET,
        },
      ]}
    >
      <Image
        accessible={false}
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={decoration.source}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
