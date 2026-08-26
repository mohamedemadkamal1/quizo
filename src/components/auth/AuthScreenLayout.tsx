import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
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
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthLanguageSelector } from '@/components/auth/AuthLanguageSelector';
import { AuthSupportButton } from '@/components/auth/AuthSupportButton';

type AuthScreenLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footer?: ReactNode;
  /**
   * Opt-in, because this layout backs every auth screen and the language
   * control belongs only on Welcome.
   */
  showLanguageSelector?: boolean;
}>;

export function AuthScreenLayout({
  title,
  subtitle,
  footer,
  showLanguageSelector = false,
  children,
}: AuthScreenLayoutProps) {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const heroHeight = getAuthHeroHeight(screenHeight);
  const { height: keyboardHeight, progress } =
    useReanimatedKeyboardAnimation();

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

  const supportAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
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

          <AuthHeading title={title} subtitle={subtitle} />

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

      <Animated.View style={[styles.supportContainer, supportAnimatedStyle]}>
        <AuthSupportButton />
      </Animated.View>

      {/*
        Sits above the scroll view rather than inside the hero so it is never
        clipped by the hero's rounded frame, never translated away with the
        keyboard animation, and always clear of the status bar.
      */}
      {showLanguageSelector ? (
        <View
          pointerEvents="box-none"
          style={[styles.languageSelector, { top: insets.top + 8 }]}
        >
          <AuthLanguageSelector />
        </View>
      ) : null}
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

  languageSelector: {
    position: 'absolute',
    zIndex: 10,
    end: 16,
  },

  supportContainer: {
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
});
