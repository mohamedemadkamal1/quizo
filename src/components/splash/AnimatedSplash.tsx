import { useEffect } from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const islamicBackground: ImageSourcePropType = require('../../../assets/images/splash/1.png');

const character: ImageSourcePropType = require('../../../assets/images/splash/2.png');

const quizoLogo: ImageSourcePropType = require('../../../assets/images/splash/3.png');

type AnimatedSplashProps = {
  onFinish: () => void;
};

const SLIDE_DURATION = 1000;

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const { width, height } = useWindowDimensions();

  // Make the composition responsive without letting it become too large.
  const stageSize = Math.min(width - 32, 430);

  const backgroundTranslateX = useSharedValue(-width);
  const characterTranslateX = useSharedValue(width);
  const logoTranslateY = useSharedValue(height);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    const slideAnimation = {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.cubic),
    };

    // Image 1: from the left.
    backgroundTranslateX.value = withTiming(0, slideAnimation);

    // Image 2: from the right, after image 1.
    characterTranslateX.value = withDelay(500, withTiming(0, slideAnimation));

    // Image 3: from the bottom, after image 2.
    logoTranslateY.value = withDelay(1000, withTiming(0, slideAnimation));

    // Keep the completed logo visible briefly, then fade the splash out.
    const fadeTimer = setTimeout(() => {
      splashOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });
    }, 2300);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2550);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [
    backgroundTranslateX,
    characterTranslateX,
    logoTranslateY,
    onFinish,
    splashOpacity,
  ]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: backgroundTranslateX.value }],
  }));

  const characterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: characterTranslateX.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, containerAnimatedStyle]}
      pointerEvents="auto"
    >
      <View
        style={[
          styles.stage,
          {
            width: stageSize,
            height: stageSize,
          },
        ]}
      >
        <Animated.Image
          source={islamicBackground}
          resizeMode="contain"
          style={[styles.backgroundImage, backgroundAnimatedStyle]}
        />

        <Animated.Image
          source={character}
          resizeMode="contain"
          style={[styles.characterImage, characterAnimatedStyle]}
        />

        <Animated.Image
          source={quizoLogo}
          resizeMode="contain"
          style={[styles.logoImage, logoAnimatedStyle]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  stage: {
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundImage: {
    position: 'absolute',
    top: '1%',
    left: '9%',
    width: '82%',
    height: '82%',
    zIndex: 1,
  },

  characterImage: {
    position: 'absolute',
    top: '1%',
    left: '12%',
    width: '76%',
    height: '76%',
    zIndex: 2,
  },

  logoImage: {
    position: 'absolute',
    bottom: '0%',
    left: '0%',
    width: '100%',
    height: '48%',
    zIndex: 3,
  },
});
