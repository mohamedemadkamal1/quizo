import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { PanResponder, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();
  const { isRTL } = useLanguageDirection();
  const normalizedValue = clamp(value);
  const progress = useSharedValue(normalizedValue);
  const trackWidth = useSharedValue(0);
  const [measuredTrackWidth, setMeasuredTrackWidth] = useState(0);
  // The track fills from the reading side, so the thumb travels towards the
  // physical left in Arabic and towards the physical right in English.
  const travelSign = isRTL ? -1 : 1;

  useEffect(() => {
    progress.set(clamp(value));
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * trackWidth.value,
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          travelSign *
          progress.value *
          Math.max(0, trackWidth.value - THUMB_SIZE),
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
        // `locationX` is always a physical offset from the view's left edge,
        // so it is flipped by hand when the interface runs right-to-left.
        const ratio = event.nativeEvent.locationX / measuredTrackWidth;

        setProgress(isRTL ? 1 - ratio : ratio, commit);
      }
    },
    [isRTL, measuredTrackWidth, setProgress],
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
      <AppText numberOfLines={1} style={styles.label}>
        {t('profile.soundLabel')}
      </AppText>

      <View
        accessible
        accessibilityActions={[
          { name: 'increment', label: t('profile.soundIncrease') },
          { name: 'decrement', label: t('profile.soundDecrease') },
        ]}
        accessibilityLabel={t('profile.soundPreference')}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(normalizedValue * 100),
          text: t('profile.soundValue', {
            percent: Math.round(normalizedValue * 100),
          }),
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
    minWidth: 55,
    flexShrink: 0,
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
    end: 0,
    start: 0,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.settings.sliderTrack,
  },
  fill: {
    position: 'absolute',
    start: 0,
    height: 14,
    overflow: 'hidden',
    borderRadius: 7,
  },
  thumb: {
    position: 'absolute',
    start: 0,
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
