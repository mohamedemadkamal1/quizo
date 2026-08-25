import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import {
  AnswerOption,
  type AnswerVisualState,
} from '@/components/questions/AnswerOption';
import { GameplayOverlayHost } from '@/components/questions/GameplayOverlay';
import { QuestionCard } from '@/components/questions/QuestionCard';
import type { CharacterReaction } from '@/components/questions/QuestionCharacter';
import { QuestionHeader } from '@/components/questions/QuestionHeader';
import {
  gameplayColors,
  QUESTION_CONTENT_MAX_WIDTH,
  QUESTION_REFERENCE_WIDTH,
} from '@/constants/questions';
import type { useQuestionsScreen } from '@/hooks/questions/useQuestionsScreen';
import { useTranslation } from '@/hooks/useTranslation';
import type { QuestionAnswerResult } from '@/types/questions.types';

type QuestionsContentProps = {
  screen: ReturnType<typeof useQuestionsScreen>;
};

function QuestionsStatePanel({
  message,
  loading = false,
  actionLabel,
  onAction,
}: {
  message: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <SafeAreaView style={styles.stateSafeArea}>
      <View style={styles.statePanel}>
        {loading ? (
          <ActivityIndicator size="large" color={gameplayColors.primaryText} />
        ) : null}
        <AppText
          accessibilityRole={loading ? undefined : 'alert'}
          style={styles.stateMessage}
        >
          {message}
        </AppText>
        {actionLabel && onAction ? (
          <Pressable
            accessibilityRole="button"
            android_ripple={{ color: 'rgba(72, 91, 221, 0.08)' }}
            onPress={onAction}
            style={styles.stateAction}
          >
            <AppText style={styles.stateActionLabel}>{actionLabel}</AppText>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function getCharacterReaction(
  feedback: QuestionAnswerResult | null,
): CharacterReaction {
  if (!feedback) {
    return 'idle';
  }

  return feedback.isCorrect ? 'correct' : 'wrong';
}

function getAnswerVisualState(
  optionId: number,
  selectedOptionId: number | null,
  revealedCorrectOptionId: number | null,
  feedback: QuestionAnswerResult | null,
): AnswerVisualState {
  if (revealedCorrectOptionId === optionId) {
    return 'correct';
  }

  if (!feedback || selectedOptionId !== optionId) {
    return 'idle';
  }

  return feedback.isCorrect ? 'correct' : 'wrong';
}

export function QuestionsContent({ screen }: QuestionsContentProps) {
  const { t } = useTranslation();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (screen.state.status === 'loading') {
    return <QuestionsStatePanel loading message={t('questions.loading')} />;
  }

  if (screen.state.status === 'invalid') {
    return (
      <QuestionsStatePanel
        actionLabel={t('common.return')}
        message={t('questions.invalidLink')}
        onAction={screen.handleInvalidRoute}
      />
    );
  }

  if (screen.state.status === 'error') {
    return (
      <QuestionsStatePanel
        actionLabel={t('common.tryAgain')}
        message={screen.state.message}
        onAction={screen.handleRetry}
      />
    );
  }

  if (screen.state.status === 'completed') {
    return (
      <QuestionsStatePanel
        actionLabel={t('questions.backToMap')}
        message={screen.state.message}
        onAction={screen.handleCompleted}
      />
    );
  }

  const { readyState, currentQuestion } = screen;
  if (!readyState || !currentQuestion) {
    return (
      <QuestionsStatePanel
        actionLabel={t('common.return')}
        message={t('questions.noQuestions')}
        onAction={screen.handleInvalidRoute}
      />
    );
  }

  const contentWidth = Math.min(windowWidth, QUESTION_CONTENT_MAX_WIDTH);
  const scale = contentWidth / QUESTION_REFERENCE_WIDTH;
  const availableHeight = windowHeight - insets.top - insets.bottom;
  const verticalScale = Math.min(scale, availableHeight / 720);
  const answersTop =
    (currentQuestion.type === 'multiple-choice' ? 360 : 374) * verticalScale;
  const answerGap =
    (currentQuestion.type === 'multiple-choice' ? 11 : 10) * verticalScale;
  const answersDisabled =
    readyState.phase !== 'answering' || readyState.overlay !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.surface,
          {
            width: contentWidth,
          },
        ]}
      >
        <View style={styles.canvas}>
          <QuestionHeader
            currentIndex={readyState.questionIndex}
            onPause={screen.handlePause}
            scale={scale}
            totalQuestions={readyState.session.totalQuestions}
            verticalScale={verticalScale}
          />

          <View
            style={[
              styles.questionCardPosition,
              { top: 110 * verticalScale, left: 15 * scale },
            ]}
          >
            <QuestionCard
              canReplay={screen.canReplayQuestion}
              formattedTime={screen.formattedTime}
              isSpeaking={screen.isQuestionSpeaking}
              onReplay={screen.handleReplayQuestion}
              question={currentQuestion}
              reaction={getCharacterReaction(readyState.feedback)}
              scale={scale}
              timerColor={screen.timerColor}
              timerRatio={screen.timerRatio}
            />
          </View>

          <View
            style={[
              styles.answers,
              {
                top: answersTop,
                left: 20 * scale,
                gap: answerGap,
              },
            ]}
          >
            {currentQuestion.options.map((option) => {
              const isSelected = readyState.selectedOptionId === option.id;

              return (
                <AnswerOption
                  key={option.id}
                  disabled={
                    answersDisabled ||
                    (readyState.submissionError !== null && !isSelected)
                  }
                  onPress={screen.handleSelectAnswer}
                  option={option}
                  questionType={currentQuestion.type}
                  scale={scale}
                  selected={isSelected}
                  visualState={getAnswerVisualState(
                    option.id,
                    readyState.selectedOptionId,
                    readyState.revealedCorrectOptionId,
                    readyState.feedback,
                  )}
                />
              );
            })}
          </View>

          {readyState.submissionError ? (
            <View
              accessibilityRole="alert"
              style={[
                styles.submissionError,
                {
                  top: 306 * verticalScale,
                  left: 20 * scale,
                  width: 360 * scale,
                },
              ]}
            >
              <AppText style={styles.submissionErrorMessage} numberOfLines={2}>
                {readyState.submissionError}
              </AppText>
              <Pressable
                accessibilityRole="button"
                onPress={screen.handleRetrySubmission}
                style={styles.submissionRetry}
              >
                <AppText style={styles.submissionRetryLabel}>
                  {t('common.retry')}
                </AppText>
              </Pressable>
            </View>
          ) : null}

          {readyState.phase === 'completing' ? (
            <View
              accessibilityLabel={t('questions.completingLabel')}
              accessibilityRole="progressbar"
              style={styles.completing}
            >
              <ActivityIndicator
                size="small"
                color={gameplayColors.primaryText}
              />
            </View>
          ) : null}
        </View>
      </View>

      <GameplayOverlayHost
        onCancelQuit={screen.handleCancelQuit}
        onConfirmQuit={screen.handleConfirmQuit}
        onRequestClose={screen.handleOverlayRequestClose}
        onRequestQuit={screen.handleRequestQuit}
        onResume={screen.handleResume}
        overlay={readyState.overlay}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  surface: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: gameplayColors.background,
  },
  canvas: {
    flex: 1,
    position: 'relative',
  },
  questionCardPosition: {
    position: 'absolute',
  },
  answers: {
    position: 'absolute',
  },
  completing: {
    position: 'absolute',
    right: 0,
    bottom: 18,
    left: 0,
    alignItems: 'center',
  },
  submissionError: {
    position: 'absolute',
    zIndex: 5,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  submissionErrorMessage: {
    flex: 1,
    color: '#B42318',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  submissionRetry: {
    minWidth: 52,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submissionRetryLabel: {
    color: gameplayColors.primaryText,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '700',
  },
  stateSafeArea: {
    flex: 1,
    backgroundColor: gameplayColors.background,
  },
  statePanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  stateMessage: {
    color: gameplayColors.heading,
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 27,
    textAlign: 'center',
  },
  stateAction: {
    minWidth: 150,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: 22,
    backgroundColor: gameplayColors.surface,
  },
  stateActionLabel: {
    color: gameplayColors.primaryText,
    fontFamily: 'Fredoka',
    fontSize: 17,
    fontWeight: '600',
  },
});
