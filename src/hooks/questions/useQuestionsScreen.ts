import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  AppState,
  BackHandler,
  type AppStateStatus,
} from 'react-native';

import { isCategoryId, isLevelMapDifficulty } from '@/constants/level-map';
import {
  QUESTION_FEEDBACK_DURATION_MS,
  QUESTION_TIMEOUT_FEEDBACK_MS,
  QUESTION_TIMER_INTERVAL_MS,
} from '@/constants/questions';
import {
  completeQuestionSession,
  getQuestionSession,
  submitQuestionAnswer,
} from '@/services/questions.service';
import type {
  GameplayOverlay,
  QuestionAnswerResult,
  QuestionSession,
  QuestionSessionRequest,
  QuestionsReadyState,
  QuestionsState,
  QuitDestination,
} from '@/types/questions.types';

type RouteParams = {
  categoryId?: string | string[];
  difficulty?: string | string[];
  levelId?: string | string[];
  levelNumber?: string | string[];
};

type QuestionsAction =
  | { type: 'load-start' }
  | { type: 'load-success'; session: QuestionSession }
  | { type: 'invalid' }
  | { type: 'error'; message: string }
  | { type: 'tick'; remainingMs: number }
  | { type: 'submission-start'; optionId: string | null }
  | { type: 'submission-result'; result: QuestionAnswerResult }
  | {
      type: 'show-overlay';
      overlay: Exclude<GameplayOverlay, null>;
      destination?: QuitDestination;
      remainingMs?: number;
    }
  | { type: 'cancel-quit' }
  | { type: 'resume' }
  | { type: 'next-question' }
  | { type: 'completing' };

const initialState: QuestionsState = { status: 'loading' };

function questionsReducer(
  state: QuestionsState,
  action: QuestionsAction,
): QuestionsState {
  switch (action.type) {
    case 'load-start':
      return { status: 'loading' };
    case 'load-success':
      return {
        status: 'ready',
        session: action.session,
        questionIndex: 0,
        phase: 'answering',
        selectedOptionId: null,
        feedback: null,
        remainingMs: action.session.questions[0].durationSeconds * 1000,
        overlay: null,
        pendingDestination: null,
      };
    case 'invalid':
      return { status: 'invalid' };
    case 'error':
      return { status: 'error', message: action.message };
    default:
      break;
  }

  if (state.status !== 'ready') {
    return state;
  }

  switch (action.type) {
    case 'tick':
      return {
        ...state,
        remainingMs: Math.max(0, action.remainingMs),
      };
    case 'submission-start':
      return {
        ...state,
        phase: 'submitting',
        selectedOptionId: action.optionId,
      };
    case 'submission-result':
      return {
        ...state,
        phase: 'feedback',
        feedback: action.result,
      };
    case 'show-overlay':
      return {
        ...state,
        overlay: action.overlay,
        pendingDestination: action.destination ?? state.pendingDestination,
        remainingMs: action.remainingMs ?? state.remainingMs,
      };
    case 'cancel-quit':
      return {
        ...state,
        overlay: 'pause',
        pendingDestination: null,
      };
    case 'resume':
      return {
        ...state,
        overlay: null,
        pendingDestination: null,
      };
    case 'next-question': {
      const questionIndex = state.questionIndex + 1;
      const nextQuestion = state.session.questions[questionIndex];

      if (!nextQuestion) {
        return { ...state, phase: 'completing' };
      }

      return {
        ...state,
        questionIndex,
        phase: 'answering',
        selectedOptionId: null,
        feedback: null,
        remainingMs: nextQuestion.durationSeconds * 1000,
      };
    }
    case 'completing':
      return { ...state, phase: 'completing' };
    default:
      return state;
  }
}

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

function getRouteRequest(params: RouteParams): QuestionSessionRequest | null {
  const categoryId = getSingleParam(params.categoryId);
  const difficulty = getSingleParam(params.difficulty);
  const levelId = getSingleParam(params.levelId);
  const levelNumberValue = getSingleParam(params.levelNumber);
  const levelNumber = levelNumberValue ? Number(levelNumberValue) : NaN;

  if (
    !isCategoryId(categoryId) ||
    !isLevelMapDifficulty(difficulty) ||
    !levelId ||
    !Number.isInteger(levelNumber) ||
    levelNumber <= 0
  ) {
    return null;
  }

  return { categoryId, difficulty, levelId, levelNumber };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to load this question session.';
}

export function useQuestionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();
  const categoryIdParam = params.categoryId;
  const difficultyParam = params.difficulty;
  const levelIdParam = params.levelId;
  const levelNumberParam = params.levelNumber;
  const routeRequest = useMemo(
    () =>
      getRouteRequest({
        categoryId: categoryIdParam,
        difficulty: difficultyParam,
        levelId: levelIdParam,
        levelNumber: levelNumberParam,
      }),
    [categoryIdParam, difficultyParam, levelIdParam, levelNumberParam],
  );
  const routeKey = routeRequest
    ? `${routeRequest.categoryId}:${routeRequest.difficulty}:${routeRequest.levelId}:${routeRequest.levelNumber}`
    : null;
  const [state, dispatch] = useReducer(questionsReducer, initialState);
  const [retryKey, setRetryKey] = useState(0);
  const stateRef = useRef(state);
  const mountedRef = useRef(true);
  const requestGenerationRef = useRef(0);
  const submissionInFlightRef = useRef(false);
  const navigationLockedRef = useRef(false);
  const pauseRequestRef = useRef(false);
  const timerDeadlineRef = useRef<number | null>(null);
  const feedbackDeadlineRef = useRef<number | null>(null);
  const feedbackRemainingRef = useRef(QUESTION_FEEDBACK_DURATION_MS);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const clearGameplayWork = useCallback(() => {
    clearFeedbackTimeout();
    timerDeadlineRef.current = null;
    feedbackDeadlineRef.current = null;
    requestGenerationRef.current += 1;
    submissionInFlightRef.current = false;
  }, [clearFeedbackTimeout]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearGameplayWork();
    };
  }, [clearGameplayWork]);

  useEffect(() => {
    if (!routeRequest || !routeKey) {
      requestGenerationRef.current += 1;
      dispatch({ type: 'invalid' });
      return;
    }

    const generation = ++requestGenerationRef.current;
    dispatch({ type: 'load-start' });
    navigationLockedRef.current = false;
    pauseRequestRef.current = false;

    void getQuestionSession(routeRequest)
      .then((session) => {
        if (
          !mountedRef.current ||
          generation !== requestGenerationRef.current
        ) {
          return;
        }

        if (
          session.categoryId !== routeRequest.categoryId ||
          session.difficulty !== routeRequest.difficulty ||
          session.levelId !== routeRequest.levelId ||
          session.levelNumber !== routeRequest.levelNumber ||
          session.totalQuestions !== session.questions.length ||
          session.questions.length === 0
        ) {
          throw new Error('The question session does not match the request.');
        }

        timerDeadlineRef.current = null;
        feedbackDeadlineRef.current = null;
        dispatch({ type: 'load-success', session });
      })
      .catch((error: unknown) => {
        if (
          !mountedRef.current ||
          generation !== requestGenerationRef.current
        ) {
          return;
        }

        dispatch({ type: 'error', message: getErrorMessage(error) });
      });
  }, [retryKey, routeKey, routeRequest]);

  const currentQuestion =
    state.status === 'ready'
      ? state.session.questions[state.questionIndex]
      : null;
  const effectStatus = state.status;
  const effectQuestionIndex =
    state.status === 'ready' ? state.questionIndex : -1;
  const effectPhase = state.status === 'ready' ? state.phase : null;
  const effectOverlay = state.status === 'ready' ? state.overlay : null;

  const advanceAfterFeedback = useCallback(async () => {
    const currentState = stateRef.current;

    if (
      currentState.status !== 'ready' ||
      currentState.phase !== 'feedback' ||
      currentState.overlay !== null
    ) {
      return;
    }

    feedbackDeadlineRef.current = null;
    feedbackRemainingRef.current = QUESTION_FEEDBACK_DURATION_MS;
    const isFinalQuestion =
      currentState.questionIndex >= currentState.session.totalQuestions - 1;

    if (!isFinalQuestion) {
      requestGenerationRef.current += 1;
      submissionInFlightRef.current = false;
      timerDeadlineRef.current = null;
      dispatch({ type: 'next-question' });
      return;
    }

    if (navigationLockedRef.current) {
      return;
    }

    dispatch({ type: 'completing' });
    const generation = ++requestGenerationRef.current;

    try {
      const completion = await completeQuestionSession({
        sessionId: currentState.session.sessionId,
      });

      if (!mountedRef.current || generation !== requestGenerationRef.current) {
        return;
      }

      if (navigationLockedRef.current) {
        return;
      }

      navigationLockedRef.current = true;
      clearGameplayWork();
      router.replace({
        pathname: '/level-complete',
        params: {
          categoryId: currentState.session.categoryId,
          difficulty: currentState.session.difficulty,
          levelId: currentState.session.levelId,
          levelNumber: currentState.session.levelNumber,
          totalQuestions: completion.totalQuestions,
          correctAnswers: completion.correctAnswers,
          wrongAnswers: completion.wrongAnswers,
          points: completion.points,
          weeklyRank: completion.weeklyRank,
        },
      });
    } catch (error: unknown) {
      if (!mountedRef.current || generation !== requestGenerationRef.current) {
        return;
      }

      dispatch({ type: 'error', message: getErrorMessage(error) });
    }
  }, [clearGameplayWork, router]);

  const submitCurrentAnswer = useCallback(
    async (optionId: string | null, timedOut = false) => {
      const currentState = stateRef.current;

      if (
        currentState.status !== 'ready' ||
        currentState.phase !== 'answering' ||
        currentState.overlay !== null ||
        submissionInFlightRef.current
      ) {
        return;
      }

      const question =
        currentState.session.questions[currentState.questionIndex];
      submissionInFlightRef.current = true;
      timerDeadlineRef.current = null;
      dispatch({ type: 'submission-start', optionId });
      const generation = ++requestGenerationRef.current;

      try {
        const result = await submitQuestionAnswer({
          sessionId: currentState.session.sessionId,
          questionId: question.id,
          selectedOptionId: optionId,
          timedOut,
        });

        if (
          !mountedRef.current ||
          generation !== requestGenerationRef.current ||
          result.questionId !== question.id
        ) {
          return;
        }

        submissionInFlightRef.current = false;
        feedbackRemainingRef.current = timedOut
          ? QUESTION_TIMEOUT_FEEDBACK_MS
          : QUESTION_FEEDBACK_DURATION_MS;
        feedbackDeadlineRef.current = null;
        dispatch({ type: 'submission-result', result });

        if (!timedOut) {
          AccessibilityInfo.announceForAccessibility(
            result.isCorrect ? 'Correct answer' : 'Wrong answer',
          );
        }
      } catch (error: unknown) {
        if (
          !mountedRef.current ||
          generation !== requestGenerationRef.current
        ) {
          return;
        }

        submissionInFlightRef.current = false;
        dispatch({ type: 'error', message: getErrorMessage(error) });
      }
    },
    [],
  );

  useEffect(() => {
    if (
      effectStatus !== 'ready' ||
      effectPhase !== 'answering' ||
      effectOverlay !== null
    ) {
      return;
    }

    if (timerDeadlineRef.current === null) {
      const currentState = stateRef.current;
      if (currentState.status !== 'ready') {
        return;
      }

      timerDeadlineRef.current = Date.now() + currentState.remainingMs;
    }

    const tick = () => {
      if (timerDeadlineRef.current === null) {
        return;
      }

      const remainingMs = Math.max(0, timerDeadlineRef.current - Date.now());
      dispatch({ type: 'tick', remainingMs });

      if (remainingMs === 0) {
        timerDeadlineRef.current = null;
        void submitCurrentAnswer(null, true);
      }
    };

    tick();
    const interval = setInterval(tick, QUESTION_TIMER_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [
    effectOverlay,
    effectPhase,
    effectQuestionIndex,
    effectStatus,
    submitCurrentAnswer,
  ]);

  useEffect(() => {
    if (
      effectStatus !== 'ready' ||
      effectPhase !== 'feedback' ||
      effectOverlay !== null
    ) {
      return;
    }

    clearFeedbackTimeout();
    const remaining = Math.max(0, feedbackRemainingRef.current);
    feedbackDeadlineRef.current = Date.now() + remaining;
    feedbackTimeoutRef.current = setTimeout(() => {
      feedbackTimeoutRef.current = null;
      void advanceAfterFeedback();
    }, remaining);

    return clearFeedbackTimeout;
  }, [
    advanceAfterFeedback,
    clearFeedbackTimeout,
    effectOverlay,
    effectPhase,
    effectQuestionIndex,
    effectStatus,
  ]);

  const freezeAndShowOverlay = useCallback(
    (
      overlay: Exclude<GameplayOverlay, null>,
      destination?: QuitDestination,
    ) => {
      const currentState = stateRef.current;

      if (
        currentState.status !== 'ready' ||
        currentState.overlay !== null ||
        pauseRequestRef.current
      ) {
        return;
      }

      pauseRequestRef.current = true;
      let remainingMs: number | undefined;

      if (
        currentState.phase === 'answering' &&
        timerDeadlineRef.current !== null
      ) {
        remainingMs = Math.max(0, timerDeadlineRef.current - Date.now());
        timerDeadlineRef.current = null;
      }

      if (
        currentState.phase === 'feedback' &&
        feedbackDeadlineRef.current !== null
      ) {
        feedbackRemainingRef.current = Math.max(
          0,
          feedbackDeadlineRef.current - Date.now(),
        );
        feedbackDeadlineRef.current = null;
        clearFeedbackTimeout();
      }

      dispatch({
        type: 'show-overlay',
        overlay,
        destination,
        remainingMs,
      });
    },
    [clearFeedbackTimeout],
  );

  const handlePause = useCallback(() => {
    freezeAndShowOverlay('pause');
  }, [freezeAndShowOverlay]);

  const handleResume = useCallback(() => {
    const currentState = stateRef.current;

    if (currentState.status !== 'ready' || currentState.overlay !== 'pause') {
      return;
    }

    pauseRequestRef.current = false;
    timerDeadlineRef.current = null;
    feedbackDeadlineRef.current = null;
    dispatch({ type: 'resume' });
  }, []);

  const handleRequestQuit = useCallback(
    (destination: QuitDestination) => {
      const currentState = stateRef.current;

      if (currentState.status !== 'ready') {
        return;
      }

      if (currentState.overlay === 'pause') {
        dispatch({ type: 'show-overlay', overlay: 'quit', destination });
        return;
      }

      freezeAndShowOverlay('quit', destination);
    },
    [freezeAndShowOverlay],
  );

  const handleCancelQuit = useCallback(() => {
    const currentState = stateRef.current;

    if (currentState.status !== 'ready' || currentState.overlay !== 'quit') {
      return;
    }

    dispatch({ type: 'cancel-quit' });
  }, []);

  const handleConfirmQuit = useCallback(() => {
    const currentState = stateRef.current;

    if (
      currentState.status !== 'ready' ||
      currentState.overlay !== 'quit' ||
      !currentState.pendingDestination ||
      navigationLockedRef.current
    ) {
      return;
    }

    navigationLockedRef.current = true;
    const destination = currentState.pendingDestination;
    clearGameplayWork();

    if (destination === 'map') {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/home');
      }
      return;
    }

    router.dismissTo('/(tabs)/home');
  }, [clearGameplayWork, router]);

  const handleOverlayRequestClose = useCallback(() => {
    const currentState = stateRef.current;

    if (currentState.status !== 'ready') {
      return;
    }

    if (currentState.overlay === 'quit') {
      handleCancelQuit();
    } else if (currentState.overlay === 'pause') {
      handleResume();
    }
  }, [handleCancelQuit, handleResume]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = appStateRef.current === 'active';
      appStateRef.current = nextState;

      if (wasActive && nextState !== 'active') {
        handlePause();
      }
    });

    return () => subscription.remove();
  }, [handlePause]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const currentState = stateRef.current;

        if (currentState.status !== 'ready') {
          return false;
        }

        if (currentState.overlay !== null) {
          return true;
        }

        handleRequestQuit('map');
        return true;
      },
    );

    return () => subscription.remove();
  }, [handleRequestQuit]);

  const handleRetry = useCallback(() => {
    clearGameplayWork();
    mountedRef.current = true;
    setRetryKey((value) => value + 1);
  }, [clearGameplayWork]);

  const handleInvalidRoute = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  }, [router]);

  const readyState: QuestionsReadyState | null =
    state.status === 'ready' ? state : null;
  const durationMs = currentQuestion
    ? currentQuestion.durationSeconds * 1000
    : 1;
  const timerRatio = readyState
    ? Math.min(1, Math.max(0, readyState.remainingMs / durationMs))
    : 0;
  const remainingSeconds = readyState
    ? Math.max(0, Math.ceil(readyState.remainingMs / 1000))
    : 0;

  return {
    state,
    readyState,
    currentQuestion,
    currentNumber: readyState ? readyState.questionIndex + 1 : 0,
    timerRatio,
    formattedTime: `00:${remainingSeconds.toString().padStart(2, '0')}`,
    handleSelectAnswer: submitCurrentAnswer,
    handlePause,
    handleResume,
    handleRequestQuit,
    handleCancelQuit,
    handleConfirmQuit,
    handleOverlayRequestClose,
    handleRetry,
    handleInvalidRoute,
  };
}
