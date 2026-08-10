import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { SettingsText as Text } from '@/components/settings/SettingsText';
import type { AudioPreferenceKey } from '@/types/settings.types';

const THUMB_SIZE = 36;
const ACCESSIBILITY_STEP = 0.1;

type AudioSliderProps = {
  label: string;
  preferenceKey: AudioPreferenceKey;
  value: number;
  colors: readonly [string, string];
  thumbColors: readonly [string, string];
  onChangeEnd: (key: AudioPreferenceKey, value: number) => void;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function AudioSlider({
  label,
  preferenceKey,
  value,
  colors: gradientColors,
  thumbColors,
  onChangeEnd,
}: AudioSliderProps) {
  const normalizedValue = clamp(value);
  const progress = useSharedValue(normalizedValue);
  const trackWidth = useSharedValue(0);
  const [measuredTrackWidth, setMeasuredTrackWidth] = useState(0);

  useEffect(() => {
    const nextValue = clamp(value);
    progress.set(nextValue);
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * trackWidth.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value * Math.max(0, trackWidth.value - THUMB_SIZE),
      },
    ],
  }));

  const setProgress = useCallback(
    (nextValue: number, commit: boolean) => {
      const clampedValue = clamp(nextValue);
      progress.set(clampedValue);

      if (commit) {
        onChangeEnd(preferenceKey, clampedValue);
      }
    },
    [onChangeEnd, preferenceKey, progress],
  );

  const updateFromGesture = useCallback(
    (event: GestureResponderEvent, commit: boolean) => {
      if (measuredTrackWidth <= 0) {
        return;
      }

      setProgress(event.nativeEvent.locationX / measuredTrackWidth, commit);
    },
    [measuredTrackWidth, setProgress],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => updateFromGesture(event, false),
        onPanResponderMove: (event) => updateFromGesture(event, false),
        onPanResponderRelease: (event) => updateFromGesture(event, true),
        onPanResponderTerminate: () => setProgress(normalizedValue, false),
      }),
    [normalizedValue, setProgress, updateFromGesture],
  );

  const onTrackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      setMeasuredTrackWidth(width);
      trackWidth.set(width);
    },
    [trackWidth],
  );

  const onAccessibilityAction = useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      const direction = event.nativeEvent.actionName === 'increment' ? 1 : -1;
      setProgress(normalizedValue + ACCESSIBILITY_STEP * direction, true);
    },
    [normalizedValue, setProgress],
  );

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View
        accessible
        accessibilityActions={[
          { name: 'increment', label: `Increase ${label.toLowerCase()}` },
          { name: 'decrement', label: `Decrease ${label.toLowerCase()}` },
        ]}
        accessibilityLabel={`${label} volume`}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(normalizedValue * 100),
          text: `${Math.round(normalizedValue * 100)} percent`,
        }}
        onAccessibilityAction={onAccessibilityAction}
        onLayout={onTrackLayout}
        style={styles.track}
        {...panResponder.panHandlers}
      >
        <View pointerEvents="none" style={styles.trackRail} />

        <Animated.View pointerEvents="none" style={[styles.fill, fillStyle]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.thumb, thumbStyle]}>
          <LinearGradient colors={thumbColors} style={styles.thumbGradient}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 15,
    paddingHorizontal: 21,
    paddingVertical: 7,
  },
  label: {
    width: 55,
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 19,
    includeFontPadding: false,
    textShadowColor: 'rgba(30, 26, 77, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  track: {
    flex: 1,
    height: THUMB_SIZE,
    justifyContent: 'center',
    borderRadius: THUMB_SIZE / 2,
  },
  trackRail: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.settings.sliderTrack,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 14,
    overflow: 'hidden',
    borderRadius: 7,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  thumbGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: THUMB_SIZE / 2,
  },
  pauseBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.settings.sliderYellow,
  },
});
