import { LinearGradient } from 'expo-linear-gradient';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import type { HomeCategory } from '@/types/home.types';

const CARD_HEIGHT = 90;
const CARD_ANIMATION_DURATION = 1000;
const INITIAL_STAGGER = 110;
const CARD_EASING = Easing.bezier(0.22, 1, 0.36, 1);

type AnimatedCategoryCardProps = {
  category: HomeCategory;
  index: number;
  sectionY: SharedValue<number>;
  scrollY: SharedValue<number>;
  scrollDirection: SharedValue<number>;
  viewportHeight: SharedValue<number>;
  viewportWidth: number;
  onPress: (category: HomeCategory) => void;
};

export function AnimatedCategoryCard({
  category,
  index,
  sectionY,
  scrollY,
  scrollDirection,
  viewportHeight,
  viewportWidth,
  onPress,
}: AnimatedCategoryCardProps) {
  const { t } = useTranslation();
  const relativeY = useSharedValue(-1);
  const isVisible = useSharedValue(false);
  const hasEntered = useSharedValue(false);
  const entranceSign = index % 2 === 0 ? 1 : -1;
  const exitSign = -entranceSign;
  const offscreenDistance = viewportWidth + 32;
  const translateX = useSharedValue(entranceSign * offscreenDistance);

  useAnimatedReaction(
    () => ({
      cardY: relativeY.value,
      direction: scrollDirection.value,
      top: sectionY.value + relativeY.value - scrollY.value,
      viewport: viewportHeight.value,
    }),
    (position) => {
      if (position.cardY < 0 || position.viewport <= 0) {
        return;
      }

      const cardBottom = position.top + CARD_HEIGHT;
      const crossesEntrance =
        position.top < position.viewport - 32 && cardBottom > 8;
      const leavesThroughBottom =
        position.direction < 0 && position.top > position.viewport - 16;
      const leavesThroughTop = position.direction > 0 && cardBottom < -24;

      if (!isVisible.value && crossesEntrance) {
        const isInitiallyVisible = !hasEntered.value && scrollY.value <= 1;
        const delay = isInitiallyVisible ? index * INITIAL_STAGGER : 0;
        const entrySign = position.direction < 0 ? exitSign : entranceSign;

        isVisible.value = true;
        hasEntered.value = true;
        cancelAnimation(translateX);
        translateX.value = entrySign * offscreenDistance;
        translateX.value = withDelay(
          delay,
          withTiming(0, {
            duration: CARD_ANIMATION_DURATION,
            easing: CARD_EASING,
            reduceMotion: ReduceMotion.System,
          }),
          ReduceMotion.System,
        );
        return;
      }

      if (isVisible.value && leavesThroughBottom) {
        isVisible.value = false;
        cancelAnimation(translateX);
        translateX.value = withTiming(exitSign * offscreenDistance, {
          duration: CARD_ANIMATION_DURATION,
          easing: CARD_EASING,
          reduceMotion: ReduceMotion.System,
        });
        return;
      }

      if (isVisible.value && leavesThroughTop) {
        isVisible.value = false;
        cancelAnimation(translateX);
        translateX.value = entranceSign * offscreenDistance;
        return;
      }

      if (
        !isVisible.value &&
        position.direction >= 0 &&
        position.top > position.viewport + 32
      ) {
        const hiddenSign = position.direction < 0 ? exitSign : entranceSign;

        cancelAnimation(translateX);
        translateX.value = hiddenSign * offscreenDistance;
      }
    },
    [entranceSign, exitSign, index, offscreenDistance],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    relativeY.set(event.nativeEvent.layout.y);
  };

  const fillWidth = `${category.visualFillRatio * 100}%` as `${number}%`;
  const levelsLabel = t('home.levelCount', { count: category.levelCount });

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[styles.shadow, animatedStyle]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('home.categoryLabel', {
          name: category.name,
          levels: levelsLabel,
          progress: category.displayedProgress,
        })}
        onPress={() => onPress(category)}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0.12, y: 0 }}
          end={{ x: 0.88, y: 1 }}
          style={styles.gradient}
        >
          <View pointerEvents="none" style={styles.decoration} />

          <View style={styles.topRow}>
            <View style={styles.identity}>
              <View style={styles.iconContainer}>
                <AppText style={styles.icon}>{category.icon}</AppText>
              </View>

              <View style={styles.labelGroup}>
                <AppText numberOfLines={1} style={styles.title}>
                  {category.name}
                </AppText>
                <AppText numberOfLines={1} style={styles.levels}>
                  {levelsLabel}
                </AppText>
              </View>
            </View>

            <View style={styles.xpBadge}>
              <AppText style={styles.xpSparkle}>✦</AppText>
              <AppText style={styles.xpText}>
                {t('home.xpBadge', { xp: category.xp })}
              </AppText>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: fillWidth }]} />
            </View>
            <AppText style={styles.percentage}>
              {category.displayedProgress}%
            </AppText>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 22,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 6,
        spreadDistance: -1,
        color: 'rgba(0, 0, 0, 0.10)',
      },
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadDistance: -2,
        color: 'rgba(0, 0, 0, 0.10)',
      },
    ],
  },
  pressable: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 22,
  },
  pressed: {
    opacity: 0.9,
  },
  gradient: {
    width: '100%',
    height: CARD_HEIGHT,
    overflow: 'hidden',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  decoration: {
    position: 'absolute',
    top: -12,
    end: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.home.categoryDecoration,
  },
  topRow: {
    zIndex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identity: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingEnd: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.home.categoryGlass,
    boxShadow: [
      {
        inset: true,
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.05)',
      },
    ],
  },
  icon: {
    fontSize: 24,
    lineHeight: 36,
    includeFontPadding: false,
  },
  labelGroup: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22.5,
    color: colors.home.categoryText,
    includeFontPadding: false,
  },
  levels: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 17,
    color: colors.home.categorySubtext,
    includeFontPadding: false,
  },
  xpBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.home.categoryBadge,
  },
  xpSparkle: {
    fontSize: 10,
    lineHeight: 19.5,
    color: colors.home.categoryText,
    includeFontPadding: false,
  },
  xpText: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19.5,
    color: colors.home.categoryBadgeText,
    includeFontPadding: false,
  },
  progressRow: {
    height: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    marginTop: 6,
    paddingEnd: 8,
  },
  progressTrack: {
    height: 8,
    minWidth: 0,
    flex: 1,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.home.progressTrack,
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.home.categoryText,
  },
  percentage: {
    minWidth: 34,
    flexShrink: 0,
    fontFamily: 'Fredoka',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: colors.home.categoryText,
    includeFontPadding: false,
  },
});
