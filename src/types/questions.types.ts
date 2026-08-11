import type { CategoryId } from '@/types/home.types';
import type { LevelMapDifficulty } from '@/types/level-map.types';

export type QuestionType = 'multiple-choice' | 'true-false';

export type QuestionOption = {
  id: string;
  label: string;
};

export type GameplayQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  durationSeconds: number;
  options: QuestionOption[];
};

export type QuestionSessionRequest = {
  categoryId: CategoryId;
  difficulty: LevelMapDifficulty;
  levelId: string;
  levelNumber: number;
};

export type QuestionSession = QuestionSessionRequest & {
  sessionId: string;
  totalQuestions: number;
  questions: GameplayQuestion[];
};

export type SubmitQuestionAnswerRequest = {
  sessionId: string;
  questionId: string;
  selectedOptionId: string | null;
  timedOut: boolean;
};

export type QuestionAnswerResult = {
  questionId: string;
  isCorrect: boolean;
  correctOptionId: string;
};

export type CompleteQuestionSessionRequest = {
  sessionId: string;
};

export type CompleteQuestionSessionResult = {
  sessionId: string;
  completed: true;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  points: number;
  weeklyRank: number;
};

export type GameplayPhase =
  'answering' | 'submitting' | 'feedback' | 'completing';

export type GameplayOverlay = 'pause' | 'quit' | null;
export type QuitDestination = 'map' | 'home';

export type QuestionsReadyState = {
  status: 'ready';
  session: QuestionSession;
  questionIndex: number;
  phase: GameplayPhase;
  selectedOptionId: string | null;
  feedback: QuestionAnswerResult | null;
  remainingMs: number;
  overlay: GameplayOverlay;
  pendingDestination: QuitDestination | null;
};

export type QuestionsState =
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'error'; message: string }
  | QuestionsReadyState;
