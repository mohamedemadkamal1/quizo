import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';

import {
  QuestionCharacter,
  type CharacterReaction,
} from '@/components/questions/QuestionCharacter';
import {
  ClockGlyph,
  SpeakerGlyph,
} from '@/components/questions/QuestionIcons';
import { gameplayColors, gameplayGradients } from '@/constants/questions';
import { useTranslation } from '@/hooks/useTranslation';
import type { GameplayQuestion } from '@/types/questions.types';

type QuestionCardProps = {
  canReplay: boolean;
  question: GameplayQuestion;
  formattedTime: string;
  timerRatio: number;
  timerColor: string;
  reaction: CharacterReaction;
  scale: number;
  isSpeaking: boolean;
  onReplay: () => void;
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
  canReplay,
  question,
  formattedTime,
  timerRatio,
  timerColor,
  reaction,
  scale,
  isSpeaking,
  onReplay,
}: QuestionCardProps) {
  const { t } = useTranslation();
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

      <Pressable
        accessibilityLabel={t(
          isSpeaking
            ? 'questions.stopReadingQuestionLabel'
            : 'questions.readQuestionLabel',
        )}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canReplay, selected: isSpeaking }}
        android_ripple={{ color: 'rgba(72, 91, 221, 0.12)' }}
        disabled={!canReplay}
        hitSlop={6}
        onPress={onReplay}
        style={[
          styles.speakerButton,
          {
            top: 8 * scale,
            start: 19 * scale,
            width: 34 * scale,
            height: 34 * scale,
            borderRadius: 17 * scale,
          },
          isSpeaking && styles.speakerButtonActive,
          !canReplay && styles.speakerButtonDisabled,
        ]}
      >
        <SpeakerGlyph active={isSpeaking} size={20 * scale} />
      </Pressable>

      {/*
        The prompt, clock and timer use logical offsets so the card reads from
        the correct side in Arabic, while the illustration itself is only
        repositioned — never flipped.
      */}
      <AppText
        alignToLanguage
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
  speakerButton: {
    position: 'absolute',
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
  },
  speakerButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  speakerButtonDisabled: {
    opacity: 0.5,
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
