import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const cloudLarge: ImageSourcePropType = require('../../assets/images/illustrations/level-map/sky/cloud-large.png');
const cloudWide: ImageSourcePropType = require('../../assets/images/illustrations/level-map/sky/cloud-wide.png');
const cloudSmall: ImageSourcePropType = require('../../assets/images/illustrations/level-map/sky/cloud-small.png');

const CLOUD_ASPECT_RATIO = 2.24;
const CLOUD_COPIES = [0, 1, 2, 3] as const;

type CloudLaneProps = {
  source: ImageSourcePropType;
  imageWidth: number;
  bottom: number;
  duration: number;
  direction: 'left' | 'right';
  opacity: number;
};

function CloudLane({
  source,
  imageWidth,
  bottom,
  duration,
  direction,
  opacity,
}: CloudLaneProps) {
  const reduceMotion = useReducedMotion();
  const translateX = useSharedValue(0);
  const imageHeight = imageWidth / CLOUD_ASPECT_RATIO;
  const repeatDistance = imageWidth * 0.7;

  useEffect(() => {
    cancelAnimation(translateX);
    const from = direction === 'left' ? 0 : -repeatDistance;
    const to = direction === 'left' ? -repeatDistance : 0;
    translateX.set(from);

    if (!reduceMotion) {
      translateX.set(
        withRepeat(
          withTiming(to, {
            duration,
            easing: Easing.linear,
            reduceMotion: ReduceMotion.Never,
          }),
          -1,
          false,
          undefined,
          ReduceMotion.Never,
        ),
      );
    }

    return () => cancelAnimation(translateX);
  }, [direction, duration, reduceMotion, repeatDistance, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.lane,
        {
          bottom,
          width: repeatDistance * (CLOUD_COPIES.length - 1) + imageWidth,
          height: imageHeight,
          opacity,
        },
        animatedStyle,
      ]}
    >
      {CLOUD_COPIES.map((copyIndex) => (
        <Image
          key={copyIndex}
          accessible={false}
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={source}
          style={[
            styles.cloud,
            {
              left: copyIndex * repeatDistance,
              width: imageWidth,
              height: imageHeight,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

type AnimatedCloudLayerProps = {
  mapWidth: number;
};

export function AnimatedCloudLayer({ mapWidth }: AnimatedCloudLayerProps) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <CloudLane
        bottom={-44}
        direction="left"
        duration={34000}
        imageWidth={Math.max(380, mapWidth * 1.12)}
        opacity={0.98}
        source={cloudLarge}
      />
      <CloudLane
        bottom={8}
        direction="right"
        duration={26000}
        imageWidth={Math.max(330, mapWidth * 0.94)}
        opacity={0.94}
        source={cloudWide}
      />
      <CloudLane
        bottom={78}
        direction="left"
        duration={19000}
        imageWidth={Math.max(260, mapWidth * 0.7)}
        opacity={0.88}
        source={cloudSmall}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lane: {
    position: 'absolute',
    left: 0,
  },
  cloud: {
    position: 'absolute',
    top: 0,
  },
});
