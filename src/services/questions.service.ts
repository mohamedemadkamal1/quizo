import {
  createMockQuestionCompletion,
  createMockQuestionSession,
  evaluateMockQuestionAnswer,
} from '@/mocks/questions.mock';
import type {
  CompleteQuestionSessionRequest,
  CompleteQuestionSessionResult,
  QuestionAnswerResult,
  QuestionSession,
  QuestionSessionRequest,
  SubmitQuestionAnswerRequest,
} from '@/types/questions.types';

function wait(durationMs: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, durationMs));
}

export async function getQuestionSession(
  request: QuestionSessionRequest,
): Promise<QuestionSession> {
  // Replace only this boundary when the questions endpoint is available.
  await wait(180);
  return createMockQuestionSession(request);
}

export async function submitQuestionAnswer(
  request: SubmitQuestionAnswerRequest,
): Promise<QuestionAnswerResult> {
  // The mock answer key remains private to the mock/service layer.
  await wait(160);
  return evaluateMockQuestionAnswer(request);
}

export async function completeQuestionSession(
  request: CompleteQuestionSessionRequest,
): Promise<CompleteQuestionSessionResult> {
  // No progression is persisted until the real completion endpoint exists.
  await wait(180);
  return createMockQuestionCompletion(request.sessionId);
}
