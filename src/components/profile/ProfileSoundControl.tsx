import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';

const THUMB_SIZE = 36;
const ACCESSIBILITY_STEP = 0.1;

type ProfileSoundControlProps = {
  value: number;
  onChangeEnd: (value: number) => void;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ProfileSoundControl({
  value,
  onChangeEnd,
}: ProfileSoundControlProps) {
  const normalizedValue = clamp(value);
  const progress = useSharedValue(normalizedValue);
  const trackWidth = useSharedValue(0);
  const [measuredTrackWidth, setMeasuredTrackWidth] = useState(0);

  useEffect(() => {
    progress.set(clamp(value));
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
        onChangeEnd(clampedValue);
      }
    },
    [onChangeEnd, progress],
  );
  const updateFromGesture = useCallback(
    (event: GestureResponderEvent, commit: boolean) => {
      if (measuredTrackWidth > 0) {
        setProgress(event.nativeEvent.locationX / measuredTrackWidth, commit);
      }
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
    <LinearGradient
      colors={[colors.settings.headerEnd, '#9B79ED']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
      <Text style={styles.label}>Sound</Text>

      <View
        accessible
        accessibilityActions={[
          { name: 'increment', label: 'Increase sound' },
          { name: 'decrement', label: 'Decrease sound' },
        ]}
        accessibilityLabel="Sound preference"
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
        <View pointerEvents="none" style={styles.rail} />
        <Animated.View pointerEvents="none" style={[styles.fill, fillStyle]}>
          <LinearGradient
            colors={[
              colors.settings.sliderYellow,
              colors.settings.sliderOrange,
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.thumb, thumbStyle]}>
          <LinearGradient
            colors={[colors.settings.headerEnd, colors.settings.violet]}
            style={styles.thumbGradient}
          >
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </LinearGradient>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 15,
    paddingHorizontal: 21,
    paddingVertical: 7,
    shadowColor: '#7255AE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    width: 55,
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 19,
  },
  track: {
    flex: 1,
    height: THUMB_SIZE,
    justifyContent: 'center',
    borderRadius: THUMB_SIZE / 2,
  },
  rail: {
    position: 'absolute',
    right: 0,
    left: 0,
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
