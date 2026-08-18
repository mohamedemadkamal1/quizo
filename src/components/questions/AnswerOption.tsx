import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckGlyph, WrongGlyph } from '@/components/questions/QuestionIcons';
import { gameplayColors } from '@/constants/questions';
import type { QuestionOption, QuestionType } from '@/types/questions.types';

export type AnswerVisualState = 'idle' | 'correct' | 'wrong';

type AnswerOptionProps = {
  option: QuestionOption;
  questionType: QuestionType;
  visualState: AnswerVisualState;
  disabled: boolean;
  selected: boolean;
  scale: number;
  onPress: (optionId: number) => void;
};

export function AnswerOption({
  option,
  questionType,
  visualState,
  disabled,
  selected,
  scale,
  onPress,
}: AnswerOptionProps) {
  const isFeedback = visualState !== 'idle';
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
        ? 'Right'
        : 'Wrong'
      : option.label;
  const stateDescription = !isFeedback
    ? ''
    : isChosenFeedback
      ? visualState === 'correct'
        ? ', Right'
        : ', Wrong'
      : visualState === 'correct'
        ? ', correct answer'
        : '';
  const showCheck = isFeedback
    ? visualState === 'correct'
    : questionType === 'true-false' && isTrueOption;
  const showWrong = isFeedback
    ? visualState === 'wrong'
    : questionType === 'true-false' && !isTrueOption;

  return (
    <Pressable
      accessibilityLabel={`${option.label} answer${stateDescription}`}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      android_ripple={{ color: 'rgba(72, 91, 221, 0.08)' }}
      disabled={disabled}
      onPress={() => onPress(option.id)}
      style={[
        styles.option,
        {
          width: 360 * scale,
          height: (questionType === 'true-false' ? 60 : 59) * scale,
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
      <View
        style={[
          styles.content,
          questionType === 'multiple-choice' && styles.multipleContent,
          { gap: 9 * scale, paddingHorizontal: 23 * scale },
        ]}
      >
        {questionType === 'true-false' && showCheck ? (
          <CheckGlyph color={iconColor} size={25 * scale} />
        ) : null}
        {questionType === 'true-false' && showWrong ? (
          <WrongGlyph color={iconColor} size={25 * scale} />
        ) : null}

        <Text
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
        </Text>

        {questionType === 'multiple-choice' && showCheck ? (
          <CheckGlyph color={iconColor} size={25 * scale} />
        ) : null}
        {questionType === 'multiple-choice' && showWrong ? (
          <WrongGlyph color={iconColor} size={25 * scale} />
        ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multipleContent: {
    justifyContent: 'flex-start',
  },
  label: {
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
  },
});
