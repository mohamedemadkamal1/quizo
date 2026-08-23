import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/common/AppText';
import { AnimatedCloudLayer } from '@/components/level-map/AnimatedCloudLayer';
import { LEVEL_MAP_BOUNDARY_HEIGHT } from '@/constants/level-map';
import type { LevelMapTheme } from '@/types/level-map.types';

type LevelFogBoundaryProps = {
  theme: LevelMapTheme;
  revealKey: number;
  mapWidth: number;
};

export function LevelFogBoundary({
  theme,
  revealKey,
  mapWidth,
}: LevelFogBoundaryProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-12);

  useEffect(() => {
    opacity.set(0);
    translateY.set(-12);
    opacity.set(
      withTiming(1, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
    );
    translateY.set(
      withTiming(0, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
    );
  }, [opacity, revealKey, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.boundary, animatedStyle]}
    >
      <LinearGradient
        colors={theme.fogColors}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
      <AnimatedCloudLayer mapWidth={mapWidth} />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', theme.backgroundColors[0]]}
        locations={[0, 1]}
        pointerEvents="none"
        style={styles.softEdge}
      />
      <AppText style={styles.sparkle}>{'\u2726'}</AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  boundary: {
    height: LEVEL_MAP_BOUNDARY_HEIGHT,
    overflow: 'hidden',
  },
  softEdge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 36,
  },
  sparkle: {
    position: 'absolute',
    right: 44,
    bottom: 18,
    fontSize: 21,
    color: '#FFFFFF',
  },
});
