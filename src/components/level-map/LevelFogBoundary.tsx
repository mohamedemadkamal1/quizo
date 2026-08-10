import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { LEVEL_MAP_BOUNDARY_HEIGHT } from '@/constants/level-map';
import type { LevelMapTheme } from '@/types/level-map.types';

type LevelFogBoundaryProps = {
  theme: LevelMapTheme;
  revealKey: number;
};

export function LevelFogBoundary({
  theme,
  revealKey,
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
      <View style={[styles.cloud, styles.cloudOne]} />
      <View style={[styles.cloud, styles.cloudTwo]} />
      <View style={[styles.cloud, styles.cloudThree]} />
      <Text style={styles.sparkle}>{'\u2726'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  boundary: {
    height: LEVEL_MAP_BOUNDARY_HEIGHT,
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    bottom: 20,
    height: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
  },
  cloudOne: {
    left: -28,
    width: 180,
    transform: [{ rotate: '-7deg' }],
  },
  cloudTwo: {
    left: '30%',
    bottom: 4,
    width: 210,
  },
  cloudThree: {
    right: -36,
    bottom: 38,
    width: 160,
    transform: [{ rotate: '8deg' }],
  },
  sparkle: {
    position: 'absolute',
    right: 44,
    bottom: 18,
    fontSize: 21,
    color: '#FFFFFF',
  },
});

