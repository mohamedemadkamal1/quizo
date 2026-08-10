import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AuthHero, getAuthHeroHeight } from '@/components/auth/AuthHero';

type AuthScreenLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footer?: ReactNode;
}>;

export function AuthScreenLayout({
  title,
  subtitle,
  footer,
  children,
}: AuthScreenLayoutProps) {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const heroHeight = getAuthHeroHeight(screenHeight);
  const { progress } = useReanimatedKeyboardAnimation();

  const heroFrameAnimatedStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        progress.value,
        [0, 1],
        [heroHeight, 0],
        Extrapolation.CLAMP,
      ),
    }),
    [heroHeight],
  );

  const heroAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        progress.value,
        [0, 0.8, 1],
        [1, 0.5, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [0, -heroHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }),
    [heroHeight],
  );

  const formAnimatedStyle = useAnimatedStyle(
    () => ({
      paddingTop: interpolate(
        progress.value,
        [0, 1],
        [20, insets.top + 12],
        Extrapolation.CLAMP,
      ),
      paddingBottom: interpolate(
        progress.value,
        [0, 1],
        [24, 12],
        Extrapolation.CLAMP,
      ),
    }),
    [insets.top],
  );

  const leadingSpaceAnimatedStyle = useAnimatedStyle(() => ({
    flexGrow: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }));

  const remainingSpaceAnimatedStyle = useAnimatedStyle(() => ({
    flexGrow: interpolate(progress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        bounces={false}
        mode="layout"
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.heroFrame, heroFrameAnimatedStyle]}
        >
          <Animated.View style={heroAnimatedStyle}>
            <AuthHero height={heroHeight} />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.form, formAnimatedStyle]}>
          <Animated.View style={leadingSpaceAnimatedStyle} />

          <View style={styles.heading}>
            <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
              {title}
            </Text>

            <Text className="mt-2 max-w-[320px] text-center font-nunito text-[14px] font-medium leading-5 text-muv-blue-300">
              {subtitle}
            </Text>
          </View>

          <View style={styles.sectionGap} />

          <View style={styles.actions}>{children}</View>

          {footer ? (
            <>
              <View style={styles.sectionGap} />
              <View style={styles.footer}>{footer}</View>
            </>
          ) : null}

          <Animated.View style={remainingSpaceAnimatedStyle} />
        </Animated.View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  heroFrame: {
    width: '100%',
    overflow: 'hidden',
  },

  form: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  heading: {
    width: '100%',
    alignItems: 'center',
  },

  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },

  sectionGap: {
    height: 24,
  },

  footer: {
    width: '100%',
    alignItems: 'center',
  },

  contentContainer: {
    flexGrow: 1,
  },
});
