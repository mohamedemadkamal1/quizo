import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CheckGlyph, WrongGlyph } from '@/components/questions/QuestionIcons';
import { gameplayColors } from '@/constants/questions';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useTranslation } from '@/hooks/useTranslation';
import type { QuestionOption, QuestionType } from '@/types/questions.types';

export type AnswerVisualState = 'idle' | 'correct' | 'wrong';

// Breathing room above and below a wrapped label. A single-line answer never
// reaches it — the pill's base height is taller than a padded line — so this
// only starts to matter once an answer wraps.
export const ANSWER_CONTENT_PADDING = 12;

export function getAnswerBaseHeight(questionType: QuestionType) {
  return questionType === 'true-false' ? 60 : 59;
}

type AnswerOptionProps = {
  option: QuestionOption;
  questionType: QuestionType;
  visualState: AnswerVisualState;
  disabled: boolean;
  selected: boolean;
  scale: number;
  /**
   * Height every option of the current question shares, so one long answer
   * lifts its short siblings to match instead of leaving pills of three
   * different sizes. Undefined until the first measuring pass has run.
   */
  uniformHeight?: number;
  onMeasureContent: (optionId: number, height: number) => void;
  onPress: (optionId: number) => void;
};

export function AnswerOption({
  option,
  questionType,
  visualState,
  disabled,
  selected,
  scale,
  uniformHeight,
  onMeasureContent,
  onPress,
}: AnswerOptionProps) {
  const { t } = useTranslation();
  const { directionStyle } = useLanguageDirection();
  const isFeedback = visualState !== 'idle';
  // `True` is a backend enum value, so the comparison stays untranslated even
  // though the option text the player reads is localized by the API.
  const isTrueOption = option.label === 'True';
  const iconColor = isFeedback
    ? gameplayColors.white
    : isTrueOption
      ? gameplayColors.correct
      : gameplayColors.wrong;
  // Only the option the player actually picked swaps its text for a verdict.
  // A revealed correct option keeps its label so the answer stays readable.
  const isChosenFeedback = isFeedback && selected;
  const feedbackLabel =
    questionType === 'multiple-choice' && isChosenFeedback
      ? visualState === 'correct'
        ? t('questions.answer.right')
        : t('questions.answer.wrong')
      : option.label;
  const stateDescription = !isFeedback
    ? ''
    : isChosenFeedback
      ? visualState === 'correct'
        ? t('questions.answer.stateRight')
        : t('questions.answer.stateWrong')
      : visualState === 'correct'
        ? t('questions.answer.stateCorrectAnswer')
        : '';
  const showCheck = isFeedback
    ? visualState === 'correct'
    : questionType === 'true-false' && isTrueOption;
  const showWrong = isFeedback
    ? visualState === 'wrong'
    : questionType === 'true-false' && !isTrueOption;

  return (
    <Pressable
      accessibilityLabel={t('questions.answer.label', {
        label: option.label,
        state: stateDescription,
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      android_ripple={{ color: 'rgba(72, 91, 221, 0.08)' }}
      disabled={disabled}
      onPress={() => onPress(option.id)}
      style={[
        styles.option,
        {
          width: 360 * scale,
          // `minHeight`, not `height`: the pill is free to grow with a label
          // that wraps, and `uniformHeight` then levels every option of the
          // question up to the tallest of them.
          minHeight: Math.max(
            getAnswerBaseHeight(questionType) * scale,
            uniformHeight ?? 0,
          ),
          borderRadius: 30 * scale,
          borderColor:
            visualState === 'wrong'
              ? '#D91F2D'
              : visualState === 'correct'
                ? gameplayColors.correct
                : selected
                  ? gameplayColors.primaryText
                  : gameplayColors.border,
          borderWidth: selected && !isFeedback ? 3 : 1,
          backgroundColor:
            visualState === 'correct'
              ? gameplayColors.correct
              : visualState === 'wrong'
                ? gameplayColors.wrong
                : gameplayColors.surface,
        },
      ]}
    >
      {/*
        The measurement is taken on the content rather than the pill: the pill
        already carries the shared height, so measuring it would feed that
        height straight back in and the row could only ever grow.
      */}
      <View
        onLayout={(event) =>
          onMeasureContent(option.id, event.nativeEvent.layout.height)
        }
        style={[
          styles.content,
          directionStyle,
          {
            gap: 9 * scale,
            paddingHorizontal: 23 * scale,
            paddingVertical: ANSWER_CONTENT_PADDING * scale,
          },
        ]}
      >
        {showCheck ? (
          <CheckGlyph color={iconColor} size={25 * scale} />
        ) : null}
        {showWrong ? (
          <WrongGlyph color={iconColor} size={25 * scale} />
        ) : null}

        {/*
          No `adjustsFontSizeToFit` here. The pill grows to its label now, so
          there is nothing left to shrink to — and the shrink path was itself
          the bug: paired with a fixed `lineHeight` iOS measured the scale
          against a frozen line box rather than the glyphs, which drove short
          labels far below `minimumFontScale`. "A god." rendered at a few
          points while its longer siblings stayed at full size.
        */}
        <AppText
          alignToLanguage
          style={[
            styles.label,
            {
              fontSize: 17 * scale,
              lineHeight: 22 * scale,
              color: isFeedback
                ? gameplayColors.white
                : gameplayColors.primaryText,
            },
          ]}
        >
          {feedbackLabel}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    justifyContent: 'center',
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    // Longer labels wrap inside the pill — which grows to them — instead of
    // being clipped by its width.
    minWidth: 0,
    flex: 1,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
  },
});
