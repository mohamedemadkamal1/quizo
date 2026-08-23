import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';

import {
  QuestionCharacter,
  type CharacterReaction,
} from '@/components/questions/QuestionCharacter';
import { ClockGlyph } from '@/components/questions/QuestionIcons';
import { gameplayColors, gameplayGradients } from '@/constants/questions';
import type { GameplayQuestion } from '@/types/questions.types';

type QuestionCardProps = {
  question: GameplayQuestion;
  formattedTime: string;
  timerRatio: number;
  timerColor: string;
  reaction: CharacterReaction;
  scale: number;
};

function CardDecorations() {
  return (
    <Svg
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      preserveAspectRatio="none"
      viewBox="0 0 370 188"
      style={StyleSheet.absoluteFill}
    >
      <Path
        d="m251 15 1.2 3 3.2.2-2.4 2.1.7 3.2-2.7-1.7-2.8 1.7.8-3.2-2.5-2.1 3.2-.2Z"
        fill={gameplayColors.primaryText}
        opacity="0.18"
      />
    </Svg>
  );
}

export function QuestionCard({
  question,
  formattedTime,
  timerRatio,
  timerColor,
  reaction,
  scale,
}: QuestionCardProps) {
  const trackWidth = 214 * scale;
  const fillWidth = Math.min(trackWidth, Math.max(0, trackWidth * timerRatio));

  return (
    <LinearGradient
      colors={gameplayGradients.questionCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        {
          width: 370 * scale,
          height: 188 * scale,
          borderRadius: 30 * scale,
        },
      ]}
    >
      <CardDecorations />

      {/*
        The prompt, clock and timer use logical offsets so the card reads from
        the correct side in Arabic, while the illustration itself is only
        repositioned — never flipped.
      */}
      <AppText
        style={[
          styles.prompt,
          {
            top: 46 * scale,
            start: 25 * scale,
            width: 205 * scale,
            fontSize: 21 * scale,
            lineHeight: 30 * scale,
          },
        ]}
      >
        {question.prompt}
      </AppText>

      <QuestionCharacter reaction={reaction} scale={scale} />

      <View style={[styles.clock, { start: 30 * scale, bottom: 14 * scale }]}>
        <ClockGlyph size={37 * scale} />
      </View>

      <View
        style={[
          styles.timerTrack,
          {
            start: 74 * scale,
            bottom: 27 * scale,
            width: trackWidth,
            height: 12 * scale,
            borderRadius: 6 * scale,
          },
        ]}
      >
        <View
          style={[
            styles.timerFill,
            {
              width: fillWidth,
              backgroundColor: timerColor,
            },
          ]}
        />
      </View>

      {/* The countdown is a technical readout, so it stays `00:07` in both
          languages rather than being rendered in Arabic-Indic digits. */}
      <AppText
        ltrContent
        style={[
          styles.time,
          {
            end: 29 * scale,
            bottom: 25 * scale,
            fontSize: 12 * scale,
            lineHeight: 16 * scale,
            color: timerColor,
          },
        ]}
      >
        {formattedTime}
      </AppText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 4,
  },
  prompt: {
    position: 'absolute',
    zIndex: 2,
    color: gameplayColors.primaryText,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
  },
  clock: {
    position: 'absolute',
    zIndex: 3,
  },
  timerTrack: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: gameplayColors.timerTrack,
  },
  timerFill: {
    height: '100%',
    borderRadius: 999,
  },
  time: {
    position: 'absolute',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
  },
});
