import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ClockGlyph } from '@/components/questions/QuestionIcons';
import { gameplayColors, gameplayGradients } from '@/constants/questions';
import type { GameplayPhase, GameplayQuestion } from '@/types/questions.types';

type QuestionCardProps = {
  question: GameplayQuestion;
  phase: GameplayPhase;
  formattedTime: string;
  timerRatio: number;
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
  phase,
  formattedTime,
  timerRatio,
  scale,
}: QuestionCardProps) {
  const isMultipleChoiceFeedback =
    question.type === 'multiple-choice' && phase === 'feedback';
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

      <Text
        style={[
          styles.prompt,
          {
            top: 46 * scale,
            left: 25 * scale,
            width: 205 * scale,
            fontSize: 21 * scale,
            lineHeight: 30 * scale,
          },
        ]}
      >
        {question.prompt}
      </Text>

      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={[
          styles.characterSlot,
          {
            top: 5 * scale,
            right: 21 * scale,
            width: 108 * scale,
            height: 173 * scale,
          },
        ]}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require('../../assets/images/illustrations/questions/question-character.png')}
          style={styles.character}
        />
      </View>

      <View style={[styles.clock, { left: 30 * scale, bottom: 14 * scale }]}>
        <ClockGlyph size={37 * scale} />
      </View>

      <View
        style={[
          styles.timerTrack,
          {
            left: 74 * scale,
            bottom: 27 * scale,
            width: trackWidth,
            height: 12 * scale,
            borderRadius: 6 * scale,
          },
        ]}
      >
        {isMultipleChoiceFeedback ? (
          <View
            style={[
              styles.timerFill,
              {
                width: fillWidth,
                backgroundColor: gameplayColors.correct,
              },
            ]}
          />
        ) : (
          <LinearGradient
            colors={gameplayGradients.timer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.timerFill, { width: fillWidth }]}
          />
        )}
      </View>

      <Text
        style={[
          styles.time,
          {
            right: 29 * scale,
            bottom: 25 * scale,
            fontSize: 12 * scale,
            lineHeight: 16 * scale,
            color: isMultipleChoiceFeedback
              ? gameplayColors.correct
              : gameplayColors.orange,
          },
        ]}
      >
        {formattedTime}
      </Text>
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
  characterSlot: {
    position: 'absolute',
    zIndex: 1,
  },
  character: {
    width: '100%',
    height: '100%',
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
