import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  SparkleGlyph,
  SweatDropGlyph,
} from '@/components/questions/QuestionIcons';

export type CharacterReaction = 'idle' | 'correct' | 'wrong';

// Design-sheet placement of the character inside the question card. The offset
// is logical, so the mascot sits opposite the prompt in both writing
// directions; the artwork itself is never mirrored.
const CHARACTER_TOP = 5;
const CHARACTER_END = 21;
const CHARACTER_WIDTH = 108;
const CHARACTER_HEIGHT = 173;
const IDLE_BREATH_DURATION = 1500;
const POSE_FADE_DURATION = 90;

/**
 * The mascot is drawn in three poses. Each artwork has its own dimensions and
 * its own transparent padding, so every pose carries the box that lands its
 * feet on the idle pose's ground line with its body on the idle pose's centre
 * line. Without that the boy would jump and resize when the pose changes.
 *
 * The idle pose keeps the original full-slot box, and because its artwork
 * starts 20px down its own PNG he has ~25px of headroom above his hair before
 * the card (which clips its children) cuts him off.
 */
const poses = {
  idle: {
    source: require('../../assets/images/illustrations/questions/question-character.png'),
    left: 0,
    top: 0,
    width: 108,
    height: 173,
  },
  correct: {
    source: require('../../assets/images/illustrations/level-complete/celebrating-character.png'),
    left: 17.3,
    top: 22.2,
    width: 67.2,
    height: 123.6,
  },
  wrong: {
    source: require('../../assets/images/level-failed-mascot.png'),
    left: 20.57,
    top: 60.12,
    width: 56.05,
    height: 80.83,
  },
} as const;

const timing = (
  toValue: number,
  duration: number,
  easing = Easing.inOut(Easing.quad),
) =>
  withTiming(toValue, {
    duration,
    easing,
    reduceMotion: ReduceMotion.System,
  });

type QuestionCharacterProps = {
  reaction: CharacterReaction;
  scale: number;
};

export function QuestionCharacter({ reaction, scale }: QuestionCharacterProps) {
  // The idle float runs on its own value so a reaction never has to restart it.
  const breath = useSharedValue(0);
  const hop = useSharedValue(0);
  const sway = useSharedValue(0);
  const pop = useSharedValue(1);
  const tilt = useSharedValue(0);
  const cheerPose = useSharedValue(0);
  const sadPose = useSharedValue(0);
  const cheer = useSharedValue(0);
  const sweat = useSharedValue(0);

  useEffect(() => {
    breath.set(
      withRepeat(
        withSequence(
          timing(-1, IDLE_BREATH_DURATION),
          timing(1, IDLE_BREATH_DURATION),
        ),
        -1,
        false,
        undefined,
        ReduceMotion.System,
      ),
    );

    return () => cancelAnimation(breath);
  }, [breath]);

  useEffect(() => {
    if (reaction === 'idle') {
      cheerPose.set(timing(0, POSE_FADE_DURATION));
      sadPose.set(timing(0, POSE_FADE_DURATION));
      hop.set(timing(0, 220));
      sway.set(timing(0, 220));
      pop.set(timing(1, 220));
      tilt.set(timing(0, 220));
      cheer.set(timing(0, 160));
      sweat.set(timing(0, 160));
      return;
    }

    if (reaction === 'correct') {
      // He throws a fist in the air and jumps twice, with a squash-and-stretch
      // landing. The peaks stay inside the headroom noted above.
      cheerPose.set(timing(1, POSE_FADE_DURATION));
      sadPose.set(timing(0, POSE_FADE_DURATION));
      hop.set(
        withSequence(
          timing(-16, 190, Easing.out(Easing.quad)),
          timing(0, 200, Easing.in(Easing.quad)),
          timing(-8, 150, Easing.out(Easing.quad)),
          timing(0, 170, Easing.in(Easing.quad)),
        ),
      );
      pop.set(
        withSequence(
          timing(1.08, 150),
          timing(0.94, 130),
          timing(1.03, 130),
          timing(1, 160),
        ),
      );
      tilt.set(
        withSequence(
          timing(-8, 150),
          timing(8, 180),
          timing(-4, 150),
          timing(0, 160),
        ),
      );
      sway.set(timing(0, 150));
      cheer.set(
        withSequence(
          timing(1, 260, Easing.out(Easing.back(2))),
          withDelay(420, timing(0, 260)),
        ),
      );
      return;
    }

    // Wrong: he drops down to sit cross-legged, shakes his head and slumps.
    cheerPose.set(timing(0, POSE_FADE_DURATION));
    sadPose.set(timing(1, POSE_FADE_DURATION + 60));
    sway.set(
      withSequence(
        timing(-10, 80),
        timing(10, 100),
        timing(-8, 90),
        timing(7, 90),
        timing(-3, 80),
        timing(0, 90),
      ),
    );
    tilt.set(
      withSequence(
        timing(-6, 80),
        timing(6, 100),
        timing(-3, 90),
        timing(0, 150),
      ),
    );
    hop.set(
      withSequence(
        timing(7, 260, Easing.out(Easing.quad)),
        withDelay(340, timing(0, 320)),
      ),
    );
    pop.set(withSequence(timing(0.95, 260), withDelay(340, timing(1, 320))));
    cheer.set(timing(0, 150));
    sweat.set(
      withSequence(
        timing(1, 300, Easing.out(Easing.quad)),
        withDelay(700, timing(0, 280)),
      ),
    );
  }, [cheer, cheerPose, hop, pop, reaction, sadPose, sway, sweat, tilt]);

  const characterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: sway.value * scale },
      { translateY: (hop.value + breath.value * 3) * scale },
      { rotateZ: `${tilt.value}deg` },
      { scale: pop.value },
    ],
  }));
  const idlePoseStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.max(cheerPose.value, sadPose.value),
  }));
  const correctPoseStyle = useAnimatedStyle(() => ({
    opacity: cheerPose.value,
  }));
  const wrongPoseStyle = useAnimatedStyle(() => ({ opacity: sadPose.value }));
  const cheerStyle = useAnimatedStyle(() => ({
    opacity: cheer.value,
    transform: [
      { translateY: -14 * cheer.value * scale },
      { scale: 0.4 + cheer.value * 0.6 },
    ],
  }));
  const cheerTrailStyle = useAnimatedStyle(() => ({
    opacity: cheer.value * 0.85,
    transform: [
      { translateY: -8 * cheer.value * scale },
      { scale: 0.3 + cheer.value * 0.45 },
    ],
  }));
  const sweatStyle = useAnimatedStyle(() => ({
    opacity: sweat.value,
    transform: [{ translateY: 16 * sweat.value * scale }],
  }));

  const poseBox = (pose: (typeof poses)[CharacterReaction]) => ({
    left: pose.left * scale,
    top: pose.top * scale,
    width: pose.width * scale,
    height: pose.height * scale,
  });

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[
        styles.slot,
        {
          top: CHARACTER_TOP * scale,
          end: CHARACTER_END * scale,
          width: CHARACTER_WIDTH * scale,
          height: CHARACTER_HEIGHT * scale,
        },
      ]}
    >
      <Animated.View style={[styles.characterLayer, characterStyle]}>
        <Animated.View
          style={[styles.pose, poseBox(poses.idle), idlePoseStyle]}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={poses.idle.source}
            style={styles.poseImage}
          />
        </Animated.View>
        <Animated.View
          style={[styles.pose, poseBox(poses.correct), correctPoseStyle]}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={poses.correct.source}
            style={styles.poseImage}
          />
        </Animated.View>
        <Animated.View
          style={[styles.pose, poseBox(poses.wrong), wrongPoseStyle]}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={poses.wrong.source}
            style={styles.poseImage}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.badge,
          { top: 16 * scale, left: -2 * scale },
          cheerStyle,
        ]}
      >
        <SparkleGlyph size={26 * scale} />
      </Animated.View>
      <Animated.View
        style={[
          styles.badge,
          { top: 22 * scale, right: 2 * scale },
          cheerTrailStyle,
        ]}
      >
        <SparkleGlyph size={18 * scale} />
      </Animated.View>
      <Animated.View
        style={[
          styles.badge,
          { top: 62 * scale, right: 26 * scale },
          sweatStyle,
        ]}
      >
        <SweatDropGlyph size={16 * scale} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    position: 'absolute',
  },
  characterLayer: {
    flex: 1,
  },
  pose: {
    position: 'absolute',
  },
  poseImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
  },
});
