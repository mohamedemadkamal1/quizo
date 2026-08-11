import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryLevelOption } from '@/components/home/CategoryLevelOption';
import { colors, gradients } from '@/constants/colors';
import type { CategoryLevel, HomeCategory } from '@/types/home.types';

const SHEET_DURATION = 350;

type CategoryLevelModalProps = {
  visible: boolean;
  category: HomeCategory | null;
  levels: CategoryLevel[];
  status: 'loading' | 'error' | 'invalid' | 'ready';
  errorMessage: string | null;
  retryDisabled: boolean;
  onDismissed: () => void;
  onRetry: () => void;
  onSelectLevel: (category: HomeCategory, level: CategoryLevel) => void;
};

type PendingSelection = {
  category: HomeCategory;
  level: CategoryLevel;
};

export function CategoryLevelModal({
  visible,
  category,
  levels,
  status,
  errorMessage,
  retryDisabled,
  onDismissed,
  onRetry,
  onSelectLevel,
}: CategoryLevelModalProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const sheetTranslateY = useSharedValue(windowHeight);
  const backdropOpacity = useSharedValue(0);
  const closingRef = useRef(false);
  const pendingSelectionRef = useRef<PendingSelection | null>(null);

  const finishDismiss = useCallback(() => {
    const pendingSelection = pendingSelectionRef.current;
    pendingSelectionRef.current = null;
    closingRef.current = false;
    onDismissed();

    if (pendingSelection) {
      onSelectLevel(pendingSelection.category, pendingSelection.level);
    }
  }, [onDismissed, onSelectLevel]);

  const requestDismiss = useCallback(() => {
    if (closingRef.current || !visible) {
      return;
    }

    closingRef.current = true;
    backdropOpacity.set(
      withTiming(0, {
        duration: SHEET_DURATION,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
    );
    sheetTranslateY.set(
      withTiming(
        windowHeight + 200,
        {
          duration: SHEET_DURATION,
          easing: Easing.out(Easing.cubic),
          reduceMotion: ReduceMotion.System,
        },
        (finished) => {
          if (finished) {
            runOnJS(finishDismiss)();
          }
        },
      ),
    );
  }, [
    backdropOpacity,
    finishDismiss,
    sheetTranslateY,
    visible,
    windowHeight,
  ]);

  const dismissWithoutSelection = useCallback(() => {
    pendingSelectionRef.current = null;
    requestDismiss();
  }, [requestDismiss]);

  const selectLevel = useCallback(
    (level: CategoryLevel) => {
      if (!category || level.levelCount <= 0 || closingRef.current) {
        return;
      }

      pendingSelectionRef.current = { category, level };
      requestDismiss();
    },
    [category, requestDismiss],
  );

  useEffect(() => {
    if (!visible || !category) {
      return;
    }

    closingRef.current = false;
    pendingSelectionRef.current = null;
    sheetTranslateY.set(windowHeight);
    backdropOpacity.set(0);

    const animationFrame = requestAnimationFrame(() => {
      backdropOpacity.set(
        withTiming(1, {
          duration: SHEET_DURATION,
          easing: Easing.out(Easing.cubic),
          reduceMotion: ReduceMotion.System,
        }),
      );
      sheetTranslateY.set(
        withTiming(0, {
          duration: SHEET_DURATION,
          easing: Easing.out(Easing.cubic),
          reduceMotion: ReduceMotion.System,
        }),
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [
    backdropOpacity,
    category,
    sheetTranslateY,
    visible,
    windowHeight,
  ]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return (
    <Modal
      animationType="none"
      navigationBarTranslucent
      onRequestClose={dismissWithoutSelection}
      statusBarTranslucent
      transparent
      visible={visible && category !== null}
    >
      <View style={styles.overlay}>
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close level chooser"
            onPress={dismissWithoutSelection}
            style={styles.backdrop}
          />
        </Animated.View>

        {category ? (
          <Animated.View
            accessibilityViewIsModal
            style={[
              styles.sheet,
              { paddingBottom: 24 + insets.bottom },
              sheetStyle,
            ]}
          >
            <View style={styles.mascotSlot} pointerEvents="none">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={require('../../assets/images/illustrations/home/category-level-mascot.png')}
                style={styles.mascot}
              />
            </View>

            <View style={styles.chipRow}>
              <LinearGradient
                colors={gradients.categoryModal.chip}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={styles.chip}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text numberOfLines={1} style={styles.chipText}>
                  {category.name}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.headingRow}>
              <Text style={styles.heading}>Choose Your Level!</Text>
            </View>

            <View style={styles.levels}>
              {status === 'loading' ? (
                <View
                  accessibilityLabel="Loading difficulty levels"
                  style={styles.statePanel}
                >
                  <ActivityIndicator color={colors.home.heading} size="large" />
                </View>
              ) : status === 'error' ? (
                <View style={styles.statePanel}>
                  <Text accessibilityRole="alert" style={styles.stateText}>
                    {errorMessage ?? 'Unable to load difficulty levels.'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    disabled={retryDisabled}
                    onPress={onRetry}
                    style={({ pressed }) => [
                      styles.stateButton,
                      pressed && styles.stateButtonPressed,
                      retryDisabled && styles.stateButtonDisabled,
                    ]}
                  >
                    <Text style={styles.stateButtonText}>Retry</Text>
                  </Pressable>
                </View>
              ) : status === 'invalid' ? (
                <View style={styles.statePanel}>
                  <Text accessibilityRole="alert" style={styles.stateText}>
                    This category link is invalid.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={dismissWithoutSelection}
                    style={({ pressed }) => [
                      styles.stateButton,
                      pressed && styles.stateButtonPressed,
                    ]}
                  >
                    <Text style={styles.stateButtonText}>Return to Home</Text>
                  </Pressable>
                </View>
              ) : (
                levels.map((level) => (
                  <CategoryLevelOption
                    key={level.difficulty}
                    level={level}
                    onPress={selectLevel}
                  />
                ))
              )}
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.home.modalBackdrop,
  },
  sheet: {
    width: '100%',
    maxWidth: 430,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.home.modalBackground,
  },
  mascotSlot: {
    height: 106,
    alignItems: 'center',
  },
  mascot: {
    position: 'absolute',
    top: -64,
    width: 110,
    height: 170,
  },
  chipRow: {
    height: 56,
    alignItems: 'center',
    paddingTop: 8,
  },
  chip: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipIcon: {
    flexShrink: 0,
    fontSize: 24,
    lineHeight: 32,
    includeFontPadding: false,
  },
  chipText: {
    maxWidth: 270,
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  headingRow: {
    height: 45,
    alignItems: 'center',
    paddingTop: 12,
  },
  heading: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 33,
    textAlign: 'center',
    color: colors.home.heading,
    includeFontPadding: false,
  },
  levels: {
    height: 274,
    gap: 12,
    paddingTop: 16,
  },
  statePanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  stateText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.home.heading,
    includeFontPadding: false,
  },
  stateButton: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.muvBlue300,
  },
  stateButtonPressed: {
    opacity: 0.85,
  },
  stateButtonDisabled: {
    opacity: 0.5,
  },
  stateButtonText: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
