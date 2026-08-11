import type {
  CompleteQuestionSessionResult,
  GameplayQuestion,
  QuestionAnswerResult,
  QuestionSession,
  QuestionSessionRequest,
  SubmitQuestionAnswerRequest,
} from '@/types/questions.types';

type MockQuestion = GameplayQuestion & {
  correctOptionId: string;
};

const choiceOptions = (questionId: string) => [
  { id: `${questionId}-a`, label: 'A.text' },
  { id: `${questionId}-b`, label: 'A.text' },
  { id: `${questionId}-c`, label: 'A.text' },
  { id: `${questionId}-d`, label: 'A.text' },
];

const trueFalseOptions = (questionId: string) => [
  { id: `${questionId}-true`, label: 'True' },
  { id: `${questionId}-false`, label: 'False' },
];

const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 'question-1',
    type: 'multiple-choice',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: choiceOptions('question-1'),
    correctOptionId: 'question-1-a',
  },
  {
    id: 'question-2',
    type: 'true-false',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: trueFalseOptions('question-2'),
    correctOptionId: 'question-2-true',
  },
  {
    id: 'question-3',
    type: 'multiple-choice',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: choiceOptions('question-3'),
    correctOptionId: 'question-3-b',
  },
  {
    id: 'question-4',
    type: 'true-false',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: trueFalseOptions('question-4'),
    correctOptionId: 'question-4-false',
  },
  {
    id: 'question-5',
    type: 'multiple-choice',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: choiceOptions('question-5'),
    correctOptionId: 'question-5-c',
  },
  {
    id: 'question-6',
    type: 'true-false',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: trueFalseOptions('question-6'),
    correctOptionId: 'question-6-true',
  },
  {
    id: 'question-7',
    type: 'multiple-choice',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: choiceOptions('question-7'),
    correctOptionId: 'question-7-d',
  },
  {
    id: 'question-8',
    type: 'true-false',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: trueFalseOptions('question-8'),
    correctOptionId: 'question-8-true',
  },
  {
    id: 'question-9',
    type: 'multiple-choice',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: choiceOptions('question-9'),
    correctOptionId: 'question-9-b',
  },
  {
    id: 'question-10',
    type: 'true-false',
    prompt: 'Which One is the Right Answer?',
    durationSeconds: 30,
    options: trueFalseOptions('question-10'),
    correctOptionId: 'question-10-false',
  },
];

const ANSWER_KEYS = new Map(
  MOCK_QUESTIONS.map((question) => [question.id, question.correctOptionId]),
);

const SESSION_RESULTS = new Map<string, Map<string, boolean>>();

export function createMockQuestionSession(
  request: QuestionSessionRequest,
): QuestionSession {
  const questions = MOCK_QUESTIONS.map(
    ({ correctOptionId: _correctOptionId, ...question }) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    }),
  );

  const session = {
    ...request,
    sessionId: `session-${request.categoryId}-${request.difficulty}-${request.levelId}`,
    totalQuestions: questions.length,
    questions,
  };

  SESSION_RESULTS.set(session.sessionId, new Map());
  return session;
}

export function evaluateMockQuestionAnswer(
  request: SubmitQuestionAnswerRequest,
): QuestionAnswerResult {
  const correctOptionId = ANSWER_KEYS.get(request.questionId);

  if (!correctOptionId) {
    throw new Error('The submitted question does not exist.');
  }

  const result = {
    questionId: request.questionId,
    correctOptionId,
    isCorrect:
      !request.timedOut && request.selectedOptionId === correctOptionId,
  };

  const sessionResults = SESSION_RESULTS.get(request.sessionId);
  if (!sessionResults) {
    throw new Error('The submitted question session does not exist.');
  }

  sessionResults.set(request.questionId, result.isCorrect);
  return result;
}

export function createMockQuestionCompletion(
  sessionId: string,
): CompleteQuestionSessionResult {
  const sessionResults = SESSION_RESULTS.get(sessionId);
  if (!sessionResults) {
    throw new Error('The completed question session does not exist.');
  }

  const totalQuestions = MOCK_QUESTIONS.length;
  const correctAnswers = [...sessionResults.values()].filter(Boolean).length;
  const wrongAnswers = totalQuestions - correctAnswers;

  return {
    sessionId,
    completed: true,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    points: correctAnswers * 100,
    weeklyRank: correctAnswers === totalQuestions ? 1 : 4,
  };
}
