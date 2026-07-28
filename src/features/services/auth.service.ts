import {
  ApiEnvelope,
  AuthSession,
  EmailPayload,
  ResetPasswordPayload,
  SignInPayload,
  VerifyResetCodePayload,
} from '@/features/auth/types/auth.types';
import { apiClient } from '@/lib/api/api-client';

export async function signIn(payload: SignInPayload): Promise<AuthSession> {
  const response = await apiClient.post<ApiEnvelope<AuthSession>>(
    '/auth/sign-in',
    payload,
  );

  return response.data.data;
}

export async function createGuestSession(): Promise<AuthSession> {
  const response =
    await apiClient.post<ApiEnvelope<AuthSession>>('/auth/guest');

  return response.data.data;
}

export async function requestPasswordReset(
  payload: EmailPayload,
): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload);
}

export async function resendPasswordResetCode(
  payload: EmailPayload,
): Promise<void> {
  await apiClient.post('/auth/resend-reset-code', payload);
}

export async function verifyPasswordResetCode(
  payload: VerifyResetCodePayload,
): Promise<string> {
  const response = await apiClient.post<ApiEnvelope<{ resetToken: string }>>(
    '/auth/verify-reset-code',
    payload,
  );

  return response.data.data.resetToken;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await apiClient.post('/auth/reset-password', payload);
}
