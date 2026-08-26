import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  AppState,
  BackHandler,
  type AppStateStatus,
} from "react-native";

import { isLevelMapDifficulty } from "@/constants/level-map";
import {
  gameplayColors,
  QUESTION_FEEDBACK_DURATION_MS,
  QUESTION_REVEAL_FEEDBACK_DURATION_MS,
  QUESTION_TIMER_INTERVAL_MS,
} from "@/constants/questions";
import { useQuestionNarration } from "@/hooks/questions/useQuestionNarration";
import { useTranslation } from "@/hooks/useTranslation";
import {
  getLevelMapQueryKey,
  LEVEL_MAP_LIMIT,
  LEVEL_MAP_PAGE,
} from "@/services/level-map.service";
import { getHomeQueryKey } from "@/services/home.service";
import {
  playAnswerSound,
  prepareAnswerSounds,
  releaseAnswerSounds,
} from "@/services/gameplay-audio.service";
import {
  getSessionQuestions,
  getSessionQuestionsQueryKey,
  submitAnswer,
} from "@/services/questions.service";
import type {
  GameplayOverlay,
  QuestionAnswerResult,
  QuestionSession,
  QuestionsInteractionState,
  QuestionsReadyState,
  QuestionsRouteContext,
  QuestionsState,
  QuitDestination,
  LevelCompletionData,
} from "@/types/questions.types";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/utils/get-api-error-message";
import { getLevelResultPathname } from "@/utils/get-level-result-pathname";
import { getTimerColorState } from "@/utils/get-timer-color-state";

type RouteParams = {
  categoryId?: string | string[];
  categoryName?: string | string[];
  categoryIcon?: string | string[];
  difficulty?: string | string[];
  levelId?: string | string[];
  levelNumber?: string | string[];
  sessionId?: string | string[];
};

type QuestionsAction =
  | { type: "reset" }
  | {
      type: "initialize";
      sessionId: number;
      questionIndex: number;
      durationMs: number;
    }
  | { type: "tick"; remainingMs: number }
  | {
      type: "submission-start";
      optionId: number;
      revealedCorrectOptionId: number | null;
    }
  | {
      type: "submission-result";
      result: QuestionAnswerResult;
      revealedCorrectOptionId: number | null;
    }
  | { type: "submission-error"; message: string }
  | {
      type: "show-overlay";
      overlay: Exclude<GameplayOverlay, null>;
      destination?: QuitDestination;
      remainingMs?: number;
    }
  | { type: "cancel-quit" }
  | { type: "resume" }
  | { type: "next-question"; questionIndex: number; durationMs: number };

const initialInteractionState: QuestionsInteractionState = {
  sessionId: null,
  questionIndex: 0,
  phase: "answering",
  selectedOptionId: null,
  revealedCorrectOptionId: null,
  feedback: null,
  remainingMs: 0,
  overlay: null,
  pendingDestination: null,
  submissionError: null,
};

function questionsReducer(
  state: QuestionsInteractionState,
  action: QuestionsAction,
): QuestionsInteractionState {
  switch (action.type) {
    case "reset":
      return initialInteractionState;
    case "initialize":
      return {
        ...initialInteractionState,
        sessionId: action.sessionId,
        questionIndex: action.questionIndex,
        remainingMs: action.durationMs,
      };
    case "tick":
      return {
        ...state,
        remainingMs: Math.max(0, action.remainingMs),
      };
    case "submission-start":
      return {
        ...state,
        phase: "submitting",
        selectedOptionId:
          action.revealedCorrectOptionId === null ? action.optionId : null,
        revealedCorrectOptionId: action.revealedCorrectOptionId,
        feedback: null,
        submissionError: null,
      };
    case "submission-result":
      return {
        ...state,
        phase: "feedback",
        feedback: action.result,
        revealedCorrectOptionId:
          action.revealedCorrectOptionId ?? state.revealedCorrectOptionId,
        submissionError: null,
      };
    case "submission-error":
      return {
        ...state,
        phase: "answering",
        feedback: null,
        submissionError: action.message,
      };
    case "show-overlay":
      return {
        ...state,
        overlay: action.overlay,
        pendingDestination: action.destination ?? state.pendingDestination,
        remainingMs: action.remainingMs ?? state.remainingMs,
      };
    case "cancel-quit":
      return {
        ...state,
        overlay: "pause",
        pendingDestination: null,
      };
    case "resume":
      return {
        ...state,
        overlay: null,
        pendingDestination: null,
      };
    case "next-question":
      return {
        ...state,
        questionIndex: action.questionIndex,
        phase: "answering",
        selectedOptionId: null,
        revealedCorrectOptionId: null,
        feedback: null,
        remainingMs: action.durationMs,
        submissionError: null,
      };
  }
}

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function getPositiveIntegerParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  const parsedValue = singleValue === undefined ? NaN : Number(singleValue);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function getRouteContext(params: RouteParams): QuestionsRouteContext | null {
  const categoryId = getPositiveIntegerParam(params.categoryId);
  const categoryName = getSingleParam(params.categoryName);
  const categoryIcon = getSingleParam(params.categoryIcon);
  const difficulty = getSingleParam(params.difficulty);
  const levelId = getPositiveIntegerParam(params.levelId);
  const levelNumber = getPositiveIntegerParam(params.levelNumber);
  const sessionId = getPositiveIntegerParam(params.sessionId);

  if (
    categoryId === null ||
    !categoryName?.trim() ||
    !categoryIcon ||
    !isLevelMapDifficulty(difficulty) ||
    levelId === null ||
    levelNumber === null ||
    sessionId === null
  ) {
    return null;
  }

  return {
    categoryId,
    categoryName,
    categoryIcon,
    difficulty,
    levelId,
    levelNumber,
    sessionId,
  };
}

function getFirstUnansweredQuestionIndex(session: QuestionSession) {
  return session.questions.findIndex(
    (question) => question.submittedAnswerId === null,
  );
}

export function useQuestionsScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.session?.user.id);
  const params = useLocalSearchParams<RouteParams>();
  const categoryIdParam = params.categoryId;
  const categoryNameParam = params.categoryName;
  const categoryIconParam = params.categoryIcon;
  const difficultyParam = params.difficulty;
  const levelIdParam = params.levelId;
  const levelNumberParam = params.levelNumber;
  const sessionIdParam = params.sessionId;
  const routeContext = useMemo(
    () =>
      getRouteContext({
        categoryId: categoryIdParam,
        categoryName: categoryNameParam,
        categoryIcon: categoryIconParam,
        difficulty: difficultyParam,
        levelId: levelIdParam,
        levelNumber: levelNumberParam,
        sessionId: sessionIdParam,
      }),
    [
      categoryIconParam,
      categoryIdParam,
      categoryNameParam,
      difficultyParam,
      levelIdParam,
      levelNumberParam,
      sessionIdParam,
    ],
  );
  const routeKey = routeContext
    ? `${routeContext.categoryId}:${routeContext.difficulty}:${routeContext.levelId}:${routeContext.levelNumber}:${routeContext.sessionId}`
    : null;
  const sessionId = routeContext?.sessionId ?? 0;
  const questionsQuery = useQuery({
    queryKey: getSessionQuestionsQueryKey(sessionId, language),
    queryFn: () => getSessionQuestions(sessionId),
    enabled: routeContext !== null,
    refetchOnWindowFocus: false,
  });
  const submitAnswerMutation = useMutation({
    mutationFn: submitAnswer,
    retry: false,
  });
  const [interaction, dispatch] = useReducer(
    questionsReducer,
    initialInteractionState,
  );
  const [fatalSessionError, setFatalSessionError] = useState<{
    routeKey: string | null;
    message: string;
  } | null>(null);
  const interactionRef = useRef(interaction);
  const sessionRef = useRef<QuestionSession | null>(null);
  const routeContextRef = useRef(routeContext);
  const mountedRef = useRef(true);
  const submissionGenerationRef = useRef(0);
  const submissionInFlightRef = useRef(false);
  const submittedQuestionIdsRef = useRef(new Set<number>());
  const completionRef = useRef<LevelCompletionData | null>(null);
  const navigationLockedRef = useRef(false);
  const pauseRequestRef = useRef(false);
  const timerDeadlineRef = useRef<number | null>(null);
  const timerExpiredQuestionRef = useRef<number | null>(null);
  const submitCurrentAnswerRef = useRef<
    (optionId: number, revealedCorrectOptionId?: number) => Promise<void>
  >(async () => undefined);
  const retrySubmissionRef = useRef<{
    optionId: number;
    revealedCorrectOptionId?: number;
  } | null>(null);
  const stopQuestionNarrationRef = useRef<() => void>(() => {});
  const feedbackDeadlineRef = useRef<number | null>(null);
  const feedbackRemainingRef = useRef(QUESTION_FEEDBACK_DURATION_MS);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const session = useMemo<QuestionSession | null>(() => {
    if (!routeContext || !questionsQuery.data) {
      return null;
    }

    return {
      ...routeContext,
      ...questionsQuery.data,
    };
  }, [questionsQuery.data, routeContext]);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const clearGameplayWork = useCallback(() => {
    clearFeedbackTimeout();
    stopQuestionNarrationRef.current();
    timerDeadlineRef.current = null;
    feedbackDeadlineRef.current = null;
    submissionGenerationRef.current += 1;
    submissionInFlightRef.current = false;
  }, [clearFeedbackTimeout]);

  useEffect(() => {
    interactionRef.current = interaction;
  }, [interaction]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    routeContextRef.current = routeContext;
  }, [routeContext]);

  useEffect(() => {
    void prepareAnswerSounds();

    return () => {
      mountedRef.current = false;
      clearGameplayWork();
      releaseAnswerSounds();
    };
  }, [clearGameplayWork]);

  useEffect(() => {
    clearGameplayWork();
    submittedQuestionIdsRef.current = new Set();
    completionRef.current = null;
    navigationLockedRef.current = false;
    pauseRequestRef.current = false;
    timerExpiredQuestionRef.current = null;
    retrySubmissionRef.current = null;
    dispatch({ type: "reset" });
  }, [clearGameplayWork, routeKey]);

  useEffect(() => {
    if (!session || interaction.sessionId === session.sessionId) {
      return;
    }

    submittedQuestionIdsRef.current = new Set(
      session.questions
        .filter((question) => question.submittedAnswerId !== null)
        .map((question) => question.id),
    );
    const questionIndex = getFirstUnansweredQuestionIndex(session);
    if (questionIndex < 0) {
      return;
    }

    const question = session.questions[questionIndex];
    timerExpiredQuestionRef.current = null;
    dispatch({
      type: "initialize",
      sessionId: session.sessionId,
      questionIndex,
      durationMs: question.durationSeconds * 1000,
    });
  }, [interaction.sessionId, session]);

  const currentQuestion =
    session && interaction.sessionId === session.sessionId
      ? (session.questions[interaction.questionIndex] ?? null)
      : null;
  const hasNoUnansweredQuestions =
    session !== null && getFirstUnansweredQuestionIndex(session) < 0;
  const isReady =
    session !== null &&
    currentQuestion !== null &&
    interaction.sessionId === session.sessionId;
  const fatalSessionErrorMessage =
    fatalSessionError?.routeKey === routeKey ? fatalSessionError.message : null;

  let state: QuestionsState;
  if (!routeContext) {
    state = { status: "invalid" };
  } else if (fatalSessionErrorMessage) {
    state = { status: "error", message: fatalSessionErrorMessage };
  } else if (questionsQuery.isPending && !questionsQuery.data) {
    state = { status: "loading" };
  } else if (questionsQuery.isError && !questionsQuery.data) {
    state = {
      status: "error",
      message: getApiErrorMessage(
        questionsQuery.error,
        t("questions.errorFallback"),
      ),
    };
  } else if (hasNoUnansweredQuestions && interaction.sessionId === null) {
    state = {
      status: "completed",
      message: t("questions.completedMessage"),
    };
  } else if (isReady && session) {
    state = {
      ...interaction,
      status: "ready",
      session,
    };
  } else {
    state = { status: "loading" };
  }

  const readyState: QuestionsReadyState | null =
    state.status === "ready" ? state : null;
  const questionNarration = useQuestionNarration({
    active:
      readyState?.phase === "answering" && readyState.overlay === null,
    language,
    questionKey:
      readyState && currentQuestion
        ? `${readyState.session.sessionId}:${currentQuestion.id}`
        : null,
    text: currentQuestion?.prompt,
  });
  useEffect(() => {
    stopQuestionNarrationRef.current = questionNarration.stop;
  }, [questionNarration.stop]);
  const effectStatus = state.status;
  const effectQuestionIndex = readyState?.questionIndex ?? -1;
  const effectPhase = readyState?.phase ?? null;
  const effectOverlay = readyState?.overlay ?? null;

  const advanceAfterFeedback = useCallback(() => {
    const currentInteraction = interactionRef.current;
    const currentSession = sessionRef.current;
    if (
      !currentSession ||
      currentInteraction.sessionId !== currentSession.sessionId ||
      currentInteraction.phase !== "feedback" ||
      currentInteraction.overlay !== null
    ) {
      return;
    }

    feedbackDeadlineRef.current = null;
    feedbackRemainingRef.current = QUESTION_FEEDBACK_DURATION_MS;

    const completion = completionRef.current;
    const currentRoute = routeContextRef.current;
    if (completion) {
      if (
        !currentRoute ||
        completion.sessionId !== currentSession.sessionId ||
        navigationLockedRef.current
      ) {
        return;
      }

      navigationLockedRef.current = true;
      clearGameplayWork();
      router.replace({
        pathname: getLevelResultPathname(completion.passed),
        params: {
          categoryId: currentRoute.categoryId,
          categoryName: currentRoute.categoryName,
          categoryIcon: currentRoute.categoryIcon,
          difficulty: currentRoute.difficulty,
          levelId: currentRoute.levelId,
          levelNumber: currentRoute.levelNumber,
          sessionId: completion.sessionId,
          score: completion.score,
          xpEarned: completion.xpEarned,
          correctAnswers: completion.correctAnswers,
          wrongAnswers: completion.wrongAnswers,
          durationSeconds: completion.durationSeconds,
          isReplay: String(completion.isReplay),
          alreadyCompleted: String(completion.alreadyCompleted),
          passed: String(completion.passed),
        },
      });
      return;
    }

    const nextQuestionIndex = currentSession.questions.findIndex(
      (question, index) =>
        index > currentInteraction.questionIndex &&
        question.submittedAnswerId === null &&
        !submittedQuestionIdsRef.current.has(question.id),
    );
    const nextQuestion = currentSession.questions[nextQuestionIndex];
    if (!nextQuestion) {
      submissionInFlightRef.current = false;
      setFatalSessionError({
        routeKey:
          routeContextRef.current === null
            ? null
            : `${routeContextRef.current.categoryId}:${routeContextRef.current.difficulty}:${routeContextRef.current.levelId}:${routeContextRef.current.levelNumber}:${routeContextRef.current.sessionId}`,
        message: t("questions.noRemainingQuestion"),
      });
      return;
    }

    submissionGenerationRef.current += 1;
    submissionInFlightRef.current = false;
    stopQuestionNarrationRef.current();
    timerDeadlineRef.current = null;
    timerExpiredQuestionRef.current = null;
    retrySubmissionRef.current = null;
    dispatch({
      type: "next-question",
      questionIndex: nextQuestionIndex,
      durationMs: nextQuestion.durationSeconds * 1000,
    });
  }, [clearGameplayWork, router, t]);

  const submitCurrentAnswer = useCallback(
    async (optionId: number, revealedCorrectOptionId?: number) => {
      const currentInteraction = interactionRef.current;
      const currentSession = sessionRef.current;
      const currentRoute = routeContextRef.current;
      if (
        !currentSession ||
        !currentRoute ||
        currentInteraction.sessionId !== currentSession.sessionId ||
        currentInteraction.phase !== "answering" ||
        currentInteraction.overlay !== null ||
        submissionInFlightRef.current ||
        (currentInteraction.submissionError !== null &&
          retrySubmissionRef.current?.optionId !== optionId)
      ) {
        return;
      }

      const question =
        currentSession.questions[currentInteraction.questionIndex];
      if (!question?.options.some((option) => option.id === optionId)) {
        return;
      }

      submissionInFlightRef.current = true;
      stopQuestionNarrationRef.current();
      retrySubmissionRef.current = { optionId, revealedCorrectOptionId };
      completionRef.current = null;
      timerDeadlineRef.current = null;
      dispatch({
        type: "submission-start",
        optionId,
        revealedCorrectOptionId: revealedCorrectOptionId ?? null,
      });
      const generation = ++submissionGenerationRef.current;

      try {
        const result = await submitAnswerMutation.mutateAsync({
          sessionId: currentSession.sessionId,
          questionId: question.id,
          answerId: optionId,
        });

        const latestInteraction = interactionRef.current;
        const latestSession = sessionRef.current;
        if (
          !mountedRef.current ||
          generation !== submissionGenerationRef.current ||
          latestSession?.sessionId !== currentSession.sessionId ||
          latestInteraction.questionIndex !==
            currentInteraction.questionIndex ||
          result.questionId !== question.id ||
          result.answerId !== optionId
        ) {
          return;
        }

        if (
          result.isLevelCompleted &&
          result.completion.correctAnswers + result.completion.wrongAnswers !==
            currentSession.totalQuestions
        ) {
          void queryClient.invalidateQueries({
            exact: true,
            queryKey: getSessionQuestionsQueryKey(
              currentSession.sessionId,
              language,
            ),
          });
          throw new Error(t("questions.sessionMismatch"));
        }

        submittedQuestionIdsRef.current.add(question.id);
        completionRef.current = result.isLevelCompleted
          ? result.completion
          : null;
        submissionInFlightRef.current = false;
        feedbackRemainingRef.current = result.isCorrect
          ? QUESTION_FEEDBACK_DURATION_MS
          : QUESTION_REVEAL_FEEDBACK_DURATION_MS;
        feedbackDeadlineRef.current = null;
        dispatch({
          type: "submission-result",
          result: {
            questionId: result.questionId,
            answerId: result.answerId,
            isCorrect: result.isCorrect,
          },
          // A wrong answer keeps the chosen option red and also turns the
          // correct option green for the longer reveal delay.
          revealedCorrectOptionId: result.isCorrect
            ? null
            : question.correctAnswerId,
        });
        void playAnswerSound(result.isCorrect ? "correct" : "wrong");
        void queryClient.invalidateQueries({
          exact: true,
          queryKey: getSessionQuestionsQueryKey(
            currentSession.sessionId,
            language,
          ),
        });

        if (result.isLevelCompleted) {
          void queryClient.invalidateQueries({
            exact: true,
            queryKey: getLevelMapQueryKey(
              {
                subCategoryId: currentRoute.categoryId,
                stage: currentRoute.difficulty,
                page: LEVEL_MAP_PAGE,
                limit: LEVEL_MAP_LIMIT,
              },
              language,
            ),
          });
          if (userId) {
            void queryClient.invalidateQueries({
              exact: true,
              queryKey: getHomeQueryKey(userId, language),
            });
          }
        }

        AccessibilityInfo.announceForAccessibility(
          revealedCorrectOptionId !== undefined
            ? t("questions.announcements.timeout")
            : result.isCorrect
              ? t("questions.announcements.correct")
              : t("questions.announcements.wrong"),
        );
      } catch (error: unknown) {
        if (
          !mountedRef.current ||
          generation !== submissionGenerationRef.current
        ) {
          return;
        }

        submissionInFlightRef.current = false;
        dispatch({
          type: "submission-error",
          message: getApiErrorMessage(
            error,
            t("questions.submissionErrorFallback"),
          ),
        });
      }
    },
    [language, queryClient, submitAnswerMutation, t, userId],
  );

  useEffect(() => {
    submitCurrentAnswerRef.current = submitCurrentAnswer;
  }, [submitCurrentAnswer]);

  useEffect(() => {
    if (
      effectStatus !== "ready" ||
      effectPhase !== "answering" ||
      effectOverlay !== null
    ) {
      return;
    }

    if (timerDeadlineRef.current === null) {
      const currentInteraction = interactionRef.current;
      timerDeadlineRef.current = Date.now() + currentInteraction.remainingMs;
    }

    const tick = () => {
      if (timerDeadlineRef.current === null) {
        return;
      }

      const remainingMs = Math.max(0, timerDeadlineRef.current - Date.now());
      dispatch({ type: "tick", remainingMs });

      if (remainingMs === 0) {
        timerDeadlineRef.current = null;
        const currentSession = sessionRef.current;
        const currentInteraction = interactionRef.current;
        const question =
          currentSession?.questions[currentInteraction.questionIndex];
        if (question && timerExpiredQuestionRef.current !== question.id) {
          timerExpiredQuestionRef.current = question.id;
          void submitCurrentAnswerRef.current(
            question.timeoutAnswerId,
            question.correctAnswerId,
          );
        }
      }
    };

    tick();
    const interval = setInterval(tick, QUESTION_TIMER_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [effectOverlay, effectPhase, effectQuestionIndex, effectStatus]);

  useEffect(() => {
    if (
      effectStatus !== "ready" ||
      effectPhase !== "feedback" ||
      effectOverlay !== null
    ) {
      return;
    }

    clearFeedbackTimeout();
    const remaining = Math.max(0, feedbackRemainingRef.current);
    feedbackDeadlineRef.current = Date.now() + remaining;
    feedbackTimeoutRef.current = setTimeout(() => {
      feedbackTimeoutRef.current = null;
      advanceAfterFeedback();
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
      const currentInteraction = interactionRef.current;
      if (
        currentInteraction.sessionId === null ||
        currentInteraction.overlay !== null ||
        pauseRequestRef.current
      ) {
        return;
      }

      pauseRequestRef.current = true;
      stopQuestionNarrationRef.current();
      let remainingMs: number | undefined;

      if (
        currentInteraction.phase === "answering" &&
        timerDeadlineRef.current !== null
      ) {
        remainingMs = Math.max(0, timerDeadlineRef.current - Date.now());
        timerDeadlineRef.current = null;
      }

      if (
        currentInteraction.phase === "feedback" &&
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
        type: "show-overlay",
        overlay,
        destination,
        remainingMs,
      });
    },
    [clearFeedbackTimeout],
  );

  const handlePause = useCallback(() => {
    freezeAndShowOverlay("pause");
  }, [freezeAndShowOverlay]);

  const handleResume = useCallback(() => {
    const currentInteraction = interactionRef.current;
    if (currentInteraction.overlay !== "pause") {
      return;
    }

    pauseRequestRef.current = false;
    timerDeadlineRef.current = null;
    feedbackDeadlineRef.current = null;
    dispatch({ type: "resume" });
  }, []);

  const handleRequestQuit = useCallback(
    (destination: QuitDestination) => {
      const currentInteraction = interactionRef.current;
      if (currentInteraction.sessionId === null) {
        return;
      }

      if (currentInteraction.overlay === "pause") {
        dispatch({ type: "show-overlay", overlay: "quit", destination });
        return;
      }

      freezeAndShowOverlay("quit", destination);
    },
    [freezeAndShowOverlay],
  );

  const handleCancelQuit = useCallback(() => {
    if (interactionRef.current.overlay !== "quit") {
      return;
    }

    dispatch({ type: "cancel-quit" });
  }, []);

  const handleConfirmQuit = useCallback(() => {
    const currentInteraction = interactionRef.current;
    if (
      currentInteraction.overlay !== "quit" ||
      !currentInteraction.pendingDestination ||
      navigationLockedRef.current
    ) {
      return;
    }

    navigationLockedRef.current = true;
    const destination = currentInteraction.pendingDestination;
    clearGameplayWork();

    if (destination === "map") {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/home");
      }
      return;
    }

    router.dismissTo("/(tabs)/home");
  }, [clearGameplayWork, router]);

  const handleOverlayRequestClose = useCallback(() => {
    if (interactionRef.current.overlay === "quit") {
      handleCancelQuit();
    } else if (interactionRef.current.overlay === "pause") {
      handleResume();
    }
  }, [handleCancelQuit, handleResume]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasActive = appStateRef.current === "active";
      appStateRef.current = nextState;

      if (wasActive && nextState !== "active") {
        handlePause();
      }
    });

    return () => subscription.remove();
  }, [handlePause]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentInteraction = interactionRef.current;
        if (currentInteraction.sessionId === null) {
          return false;
        }

        if (currentInteraction.overlay !== null) {
          return true;
        }

        handleRequestQuit("map");
        return true;
      },
    );

    return () => subscription.remove();
  }, [handleRequestQuit]);

  const handleRetry = useCallback(() => {
    if (!routeContext || questionsQuery.isFetching) {
      return;
    }

    setFatalSessionError(null);
    void questionsQuery.refetch();
  }, [questionsQuery, routeContext]);

  const handleRetrySubmission = useCallback(() => {
    const retrySubmission = retrySubmissionRef.current;
    if (retrySubmission) {
      void submitCurrentAnswer(
        retrySubmission.optionId,
        retrySubmission.revealedCorrectOptionId,
      );
    }
  }, [submitCurrentAnswer]);

  const handleInvalidRoute = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  }, [router]);

  const handleCompleted = useCallback(() => {
    if (navigationLockedRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    clearGameplayWork();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  }, [clearGameplayWork, router]);

  const durationMs = currentQuestion
    ? currentQuestion.durationSeconds * 1000
    : 1;
  const timerRatio = readyState
    ? Math.min(1, Math.max(0, readyState.remainingMs / durationMs))
    : 0;
  const remainingSeconds = readyState
    ? Math.max(0, Math.ceil(readyState.remainingMs / 1000))
    : 0;
  const timerColorState = getTimerColorState(remainingSeconds);
  const timerColor =
    timerColorState === "green"
      ? gameplayColors.correct
      : timerColorState === "orange"
        ? gameplayColors.orange
        : gameplayColors.wrong;

  return {
    state,
    readyState,
    currentQuestion,
    currentNumber: readyState ? readyState.questionIndex + 1 : 0,
    timerRatio,
    timerColor,
    formattedTime: `00:${remainingSeconds.toString().padStart(2, "0")}`,
    isQuestionSpeaking: questionNarration.isSpeaking,
    canReplayQuestion:
      questionNarration.canSpeak &&
      readyState?.phase === "answering" &&
      readyState.overlay === null,
    handleReplayQuestion: questionNarration.toggle,
    handleSelectAnswer: submitCurrentAnswer,
    handleRetrySubmission,
    handlePause,
    handleResume,
    handleRequestQuit,
    handleCancelQuit,
    handleConfirmQuit,
    handleOverlayRequestClose,
    handleRetry,
    handleInvalidRoute,
    handleCompleted,
  };
}
