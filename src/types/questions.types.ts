import type { ApiEnvelope } from "@/types/auth.types";
import type { SubCategoryId } from "@/types/home.types";
import type { LevelMapDifficulty } from "@/types/level-map.types";

export type StartLevelRequest = {
  levelId: number;
  subCategoryId: number;
};

export type StartLevelData = {
  id: number;
  userId: number;
  levelId: number;
  status: "STARTED";
  startedAt: string;
  submittedAt: string | null;
  durationSeconds: number | null;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
  isReplay: boolean;
  questionOrder: number;
  createdAt: string;
  updatedAt: string;
  resumed: boolean;
};

export type StartLevelApiResponse = ApiEnvelope<StartLevelData> & {
  success: true;
  statusCode: 200;
};

export type QuestionAnswerDto = {
  id: number;
  content: string;
  order: number;
  isCorrect: boolean;
};

export type SessionQuestionDto = {
  id: number;
  type: "SINGLE_CHOICE";
  content: string;
  score: number;
  media: unknown | null;
  answers: QuestionAnswerDto[];
  submittedAnswerId: number | null;
};

export type SessionQuestionsData = {
  sessionId: number;
  status: "STARTED";
  totalQuestions: number;
  answeredQuestions: number;
  canFinish: boolean;
  questions: SessionQuestionDto[];
};

export type SessionQuestionsApiResponse = ApiEnvelope<SessionQuestionsData> & {
  success: true;
  statusCode: 200;
};

export type QuestionAnswerViewModel = {
  id: number;
  content: string;
  order: number;
};

export type QuestionType = "multiple-choice" | "true-false";

export type QuestionOption = {
  id: number;
  label: string;
  order: number;
};

export type GameplayQuestion = {
  id: number;
  type: QuestionType;
  prompt: string;
  score: number;
  durationSeconds: number;
  options: QuestionOption[];
  submittedAnswerId: number | null;
};

export type SessionQuestionsViewData = Omit<
  SessionQuestionsData,
  "questions"
> & {
  questions: GameplayQuestion[];
};

export type QuestionsRouteContext = {
  categoryId: SubCategoryId;
  categoryName: string;
  categoryIcon: string;
  difficulty: LevelMapDifficulty;
  levelId: number;
  levelNumber: number;
  sessionId: number;
};

export type QuestionSession = QuestionsRouteContext & SessionQuestionsViewData;

export type SubmitAnswerRequest = {
  questionId: number;
  answerId: number;
  sessionId: number;
};

export type LevelCompletionData = {
  sessionId: number;
  status: "COMPLETED";
  isReplay: boolean;
  score: number;
  xpEarned: number;
  correctAnswers: number;
  wrongAnswers: number;
  durationSeconds: number;
  currentLevel: number;
  alreadyCompleted: boolean;
};

export type SubmitAnswerBaseData = {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
  earnedXp: number;
  isReplay: boolean;
  submittedBefore: boolean;
};

export type IncompleteSubmitAnswerData = SubmitAnswerBaseData & {
  isLevelCompleted: false;
  completion: null;
};

export type CompletedSubmitAnswerData = SubmitAnswerBaseData & {
  isLevelCompleted: true;
  completion: LevelCompletionData;
};

export type SubmitAnswerData =
  IncompleteSubmitAnswerData | CompletedSubmitAnswerData;

export type SubmitAnswerApiResponse = ApiEnvelope<SubmitAnswerData> & {
  success: true;
  statusCode: 200;
};

export type QuestionAnswerResult = {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
};

export type GameplayPhase =
  "answering" | "submitting" | "feedback" | "completing";

export type GameplayOverlay = "pause" | "quit" | null;
export type QuitDestination = "map" | "home";

export type QuestionsInteractionState = {
  sessionId: number | null;
  questionIndex: number;
  phase: GameplayPhase;
  selectedOptionId: number | null;
  feedback: QuestionAnswerResult | null;
  remainingMs: number;
  overlay: GameplayOverlay;
  pendingDestination: QuitDestination | null;
  submissionError: string | null;
};

export type QuestionsReadyState = QuestionsInteractionState & {
  status: "ready";
  session: QuestionSession;
};

export type QuestionsState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "error"; message: string }
  | { status: "completed"; message: string }
  | QuestionsReadyState;
