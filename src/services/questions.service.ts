import { QUESTION_DURATION_SECONDS } from "@/constants/questions";
import { apiClient } from "@/services/api/api-client";
import type {
  GameplayQuestion,
  LevelCompletionData,
  QuestionAnswerDto,
  SessionQuestionsViewData,
  StartLevelData,
  StartLevelRequest,
  SubmitAnswerData,
  SubmitAnswerRequest,
} from "@/types/questions.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPositiveInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0;
}

function isValidDateString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function hasValidEnvelope(value: unknown): value is Record<string, unknown> & {
  data: Record<string, unknown>;
} {
  return (
    isRecord(value) &&
    value.success === true &&
    value.statusCode === 200 &&
    isRecord(value.data)
  );
}

function parseStartLevelResponse(
  value: unknown,
  expectedLevelId: number,
): StartLevelData {
  if (!hasValidEnvelope(value)) {
    throw new Error("The start-level response is malformed.");
  }

  const {
    id,
    userId,
    levelId,
    status,
    startedAt,
    submittedAt,
    durationSeconds,
    score,
    correctAnswers,
    wrongAnswers,
    xpEarned,
    isReplay,
    questionOrder,
    createdAt,
    updatedAt,
    resumed,
  } = value.data;

  if (
    !isPositiveInteger(id) ||
    !isPositiveInteger(userId) ||
    !isPositiveInteger(levelId) ||
    levelId !== expectedLevelId ||
    status !== "STARTED" ||
    !isValidDateString(startedAt) ||
    !(submittedAt === null || isValidDateString(submittedAt)) ||
    !(durationSeconds === null || isNonNegativeNumber(durationSeconds)) ||
    !isNonNegativeNumber(score) ||
    !isNonNegativeInteger(correctAnswers) ||
    !isNonNegativeInteger(wrongAnswers) ||
    !isNonNegativeNumber(xpEarned) ||
    typeof isReplay !== "boolean" ||
    !isNonNegativeInteger(questionOrder) ||
    !isValidDateString(createdAt) ||
    !isValidDateString(updatedAt) ||
    typeof resumed !== "boolean"
  ) {
    throw new Error("The start-level response contains invalid data.");
  }

  return {
    id,
    userId,
    levelId,
    status,
    startedAt,
    submittedAt,
    durationSeconds,
    score,
    correctAnswers,
    wrongAnswers,
    xpEarned,
    isReplay,
    questionOrder,
    createdAt,
    updatedAt,
    resumed,
  };
}

function parseQuestionAnswer(value: unknown): QuestionAnswerDto {
  if (!isRecord(value)) {
    throw new Error("The questions response contains an invalid answer.");
  }

  const { id, content, order, isCorrect } = value;
  if (
    !isPositiveInteger(id) ||
    typeof content !== "string" ||
    !isPositiveInteger(order) ||
    typeof isCorrect !== "boolean"
  ) {
    throw new Error("The questions response contains an invalid answer.");
  }

  return { id, content, order, isCorrect };
}

function parseSessionQuestion(value: unknown): GameplayQuestion {
  if (
    !isRecord(value) ||
    !Object.prototype.hasOwnProperty.call(value, "media") ||
    !Array.isArray(value.answers)
  ) {
    throw new Error("The questions response contains an invalid question.");
  }

  const { id, type, content, score, answers, submittedAnswerId } = value;
  if (
    !isPositiveInteger(id) ||
    type !== "SINGLE_CHOICE" ||
    typeof content !== "string" ||
    !isNonNegativeNumber(score) ||
    answers.length === 0
  ) {
    throw new Error("The questions response contains an invalid question.");
  }

  const safeAnswers = answers
    .map(parseQuestionAnswer)
    .sort((first, second) => first.order - second.order);
  const correctAnswers = safeAnswers.filter((answer) => answer.isCorrect);
  const correctAnswer = correctAnswers[0];
  const timeoutAnswer = safeAnswers.find((answer) => !answer.isCorrect);
  const answerIds = new Set(safeAnswers.map((answer) => answer.id));
  const answerOrders = new Set(safeAnswers.map((answer) => answer.order));

  if (
    answerIds.size !== safeAnswers.length ||
    answerOrders.size !== safeAnswers.length ||
    correctAnswers.length !== 1 ||
    !correctAnswer ||
    !timeoutAnswer ||
    !(
      submittedAnswerId === null ||
      (isPositiveInteger(submittedAnswerId) && answerIds.has(submittedAnswerId))
    )
  ) {
    throw new Error("The questions response contains inconsistent answers.");
  }

  return {
    id,
    type: "multiple-choice",
    prompt: content,
    score,
    durationSeconds: QUESTION_DURATION_SECONDS,
    options: safeAnswers.map((answer) => ({
      id: answer.id,
      label: answer.content,
      order: answer.order,
    })),
    // The correct ID is used only for local timeout feedback. The backend
    // continues to receive the declared wrong timeout answer.
    correctAnswerId: correctAnswer.id,
    timeoutAnswerId: timeoutAnswer.id,
    submittedAnswerId,
  };
}

function parseSessionQuestionsResponse(
  value: unknown,
  expectedSessionId: number,
): SessionQuestionsViewData {
  if (!hasValidEnvelope(value) || !Array.isArray(value.data.questions)) {
    throw new Error("The questions response is malformed.");
  }

  const {
    sessionId,
    status,
    totalQuestions,
    answeredQuestions,
    canFinish,
    questions,
  } = value.data;

  if (
    sessionId !== expectedSessionId ||
    status !== "STARTED" ||
    !isNonNegativeInteger(totalQuestions) ||
    !isNonNegativeInteger(answeredQuestions) ||
    answeredQuestions > totalQuestions ||
    totalQuestions !== questions.length ||
    typeof canFinish !== "boolean"
  ) {
    throw new Error("The questions response contains invalid session data.");
  }

  const safeQuestions = questions.map(parseSessionQuestion);
  const questionIds = new Set(safeQuestions.map((question) => question.id));
  if (questionIds.size !== safeQuestions.length) {
    throw new Error("The questions response contains duplicate questions.");
  }

  return {
    sessionId,
    status,
    totalQuestions,
    answeredQuestions,
    canFinish,
    questions: safeQuestions,
  };
}

function parseSubmitAnswerResponse(
  value: unknown,
  request: SubmitAnswerRequest,
): SubmitAnswerData {
  if (!hasValidEnvelope(value)) {
    throw new Error("The answer-submission response is malformed.");
  }

  const {
    questionId,
    answerId,
    isCorrect,
    earnedXp,
    isReplay,
    submittedBefore,
    isLevelCompleted,
    completion,
  } = value.data;

  if (
    questionId !== request.questionId ||
    answerId !== request.answerId ||
    typeof isCorrect !== "boolean" ||
    !isNonNegativeNumber(earnedXp) ||
    typeof isReplay !== "boolean" ||
    typeof submittedBefore !== "boolean" ||
    typeof isLevelCompleted !== "boolean" ||
    !Object.prototype.hasOwnProperty.call(value.data, "completion")
  ) {
    throw new Error("The answer-submission response contains invalid data.");
  }

  const baseData = {
    questionId,
    answerId,
    isCorrect,
    earnedXp,
    isReplay,
    submittedBefore,
  };

  if (isLevelCompleted === false) {
    if (completion !== null) {
      throw new Error(
        "An incomplete answer response cannot include completion data.",
      );
    }

    return {
      ...baseData,
      isLevelCompleted: false,
      completion: null,
    };
  }

  return {
    ...baseData,
    isLevelCompleted: true,
    completion: parseLevelCompletion(completion, request.sessionId, isReplay),
  };
}

function parseLevelCompletion(
  value: unknown,
  expectedSessionId: number,
  expectedReplayState: boolean,
): LevelCompletionData {
  if (!isRecord(value)) {
    throw new Error("The completed answer response is missing its result.");
  }

  const {
    sessionId,
    status,
    isReplay,
    score,
    xpEarned,
    correctAnswers,
    wrongAnswers,
    durationSeconds,
    currentLevel,
    alreadyCompleted,
    passed,
  } = value;

  if (
    sessionId !== expectedSessionId ||
    status !== "COMPLETED" ||
    typeof isReplay !== "boolean" ||
    isReplay !== expectedReplayState ||
    !isNonNegativeNumber(score) ||
    !isNonNegativeNumber(xpEarned) ||
    !isNonNegativeInteger(correctAnswers) ||
    !isNonNegativeInteger(wrongAnswers) ||
    !isNonNegativeInteger(durationSeconds) ||
    !isPositiveInteger(currentLevel) ||
    typeof alreadyCompleted !== "boolean" ||
    typeof passed !== "boolean"
  ) {
    throw new Error("The completed answer response contains invalid data.");
  }

  return {
    sessionId,
    status,
    isReplay,
    score,
    xpEarned,
    correctAnswers,
    wrongAnswers,
    durationSeconds,
    currentLevel,
    alreadyCompleted,
    passed,
  };
}

export function getSessionQuestionsQueryKey(sessionId: number) {
  return ["session-questions", sessionId] as const;
}

export async function startLevel(
  payload: StartLevelRequest,
): Promise<StartLevelData> {
  if (
    !isPositiveInteger(payload.levelId) ||
    !isPositiveInteger(payload.subCategoryId)
  ) {
    throw new Error("Valid start-level identifiers are required.");
  }

  const response = await apiClient.post<unknown>("/levels/start", payload);
  return parseStartLevelResponse(response.data, payload.levelId);
}

export async function getSessionQuestions(
  sessionId: number,
): Promise<SessionQuestionsViewData> {
  if (!isPositiveInteger(sessionId)) {
    throw new Error("A valid question-session ID is required.");
  }

  const response = await apiClient.get<unknown>(
    `/levels/${sessionId}/questions`,
  );
  return parseSessionQuestionsResponse(response.data, sessionId);
}

export async function submitAnswer(
  payload: SubmitAnswerRequest,
): Promise<SubmitAnswerData> {
  if (
    !isPositiveInteger(payload.questionId) ||
    !isPositiveInteger(payload.answerId) ||
    !isPositiveInteger(payload.sessionId)
  ) {
    throw new Error("Valid answer-submission identifiers are required.");
  }

  const response = await apiClient.post<unknown>("/questions/submit", payload);
  return parseSubmitAnswerResponse(response.data, payload);
}
