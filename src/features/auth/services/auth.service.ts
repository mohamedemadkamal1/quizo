import {
  ApiEnvelope,
  AuthSession,
  AuthUser,
  BackendAuthUserDto,
  CompleteAccountProfileApiPayload,
  EmailPayload,
  GuestProfilePayload,
  GuestSignUpApiPayload,
  ResetPasswordPayload,
  SignInApiData,
  SignInPayload,
  SignUpApiData,
  SignUpPayload,
  VerifyOtpApiData,
  VerifyOtpApiPayload,
  VerifyResetCodePayload,
} from '@/features/auth/types/auth.types';

import { apiClient } from '@/lib/api/api-client';

function mapBackendUser(
  user: BackendAuthUserDto,
  role: AuthUser['role'],
): AuthUser {
  return {
    id: String(user.id),
    displayName: user.username,
    email: user.email,
    age: user.age,
    role,
    profileCompleted: user.profileCompleted,
  };
}

export async function signIn(payload: SignInPayload): Promise<AuthSession> {
  const response = await apiClient.post<ApiEnvelope<SignInApiData>>(
    '/auth/login',
    {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    },
  );

  const { accessToken, user } = response.data.data;

  return {
    accessToken,
    user: mapBackendUser(user, 'learner'),
  };
}

export async function createGuestSession(
  payload: GuestProfilePayload,
): Promise<AuthSession> {
  const apiPayload: GuestSignUpApiPayload = {
    signupType: 'GUEST',
    username: payload.nickname,
    age: payload.age,
  };

  const response = await apiClient.post<ApiEnvelope<SignUpApiData>>(
    '/auth/signup',
    apiPayload,
  );

  const { accessToken, user } = response.data.data;

  return {
    accessToken,
    user: {
      ...mapBackendUser(user, 'guest'),
      profileCompleted: true,
    },
  };
}

export async function completeAccountProfile(
  payload: GuestProfilePayload,
): Promise<AuthUser> {
  const apiPayload: CompleteAccountProfileApiPayload = {
    username: payload.nickname,
    age: payload.age,
  };

  const response = await apiClient.put<ApiEnvelope<BackendAuthUserDto>>(
    '/auth/profile',
    apiPayload,
  );

  return {
    ...mapBackendUser(response.data.data, 'learner'),
    profileCompleted: true,
  };
}

export async function requestPasswordReset(
  payload: EmailPayload,
): Promise<void> {
  const test = await apiClient.post<ApiEnvelope<{ message: string }>>(
    '/auth/forgot-password',
    {
      email: payload.email.trim().toLowerCase(),
    },
  );
}

export async function verifyPasswordResetCode(
  payload: VerifyResetCodePayload,
): Promise<string> {
  const apiPayload: VerifyOtpApiPayload = {
    email: payload.email.trim().toLowerCase(),
    otp: payload.code,
  };

  const response = await apiClient.post<ApiEnvelope<VerifyOtpApiData>>(
    '/auth/verify',
    apiPayload,
  );

  return response.data.data.resetToken;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await apiClient.post(
    '/auth/reset-password',
    {
      password: payload.password,
    },
    {
      headers: {
        Authorization: `Bearer ${payload.resetToken}`,
      },
    },
  );
}

export async function signUp(payload: SignUpPayload): Promise<AuthSession> {
  const response = await apiClient.post<ApiEnvelope<SignUpApiData>>(
    '/auth/signup',
    {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    },
  );

  const { accessToken, user } = response.data.data;

  return {
    accessToken,
    user: {
      ...mapBackendUser(user, 'learner'),
      profileCompleted: false,
    },
  };
}
