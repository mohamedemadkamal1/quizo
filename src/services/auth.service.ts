import {
  ApiEnvelope,
  AuthSession,
  AuthUser,
  BackendAuthUserDto,
  CompleteProfileOtpApiData,
  CompleteProfilePayload,
  EmailPayload,
  GuestProfilePayload,
  GuestSignUpApiPayload,
  ResetPasswordPayload,
  SignInApiData,
  SignInPayload,
  SignUpApiData,
  SignUpOtpApiData,
  SignUpPayload,
  VerifyAccountApiData,
  VerifyAccountPayload,
  VerifyCompleteProfileApiData,
  VerifyCompleteProfilePayload,
  VerifyOtpApiPayload,
  VerifyResetCodePayload,
  VerifyResetOtpApiData,
} from '@/types/auth.types';

import { apiClient } from '@/services/api/api-client';
import { updateProfile } from '@/services/profile.service';
import { normalizeAvatarId } from '@/types/avatar.types';
import { mapProfileDataToAuthUser } from '@/utils/profile';

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
    avatar: normalizeAvatarId(user.avatar),
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
  const data = await updateProfile({
    username: payload.nickname,
    age: payload.age,
  });

  return mapProfileDataToAuthUser(data, 'learner');
}

export async function requestPasswordReset(
  payload: EmailPayload,
): Promise<void> {
  await apiClient.post<ApiEnvelope<{ message: string }>>(
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
    purpose: 'PASSWORD_RESET',
  };

  const response = await apiClient.post<ApiEnvelope<VerifyResetOtpApiData>>(
    '/auth/verify',
    apiPayload,
  );

  return response.data.data.resetToken;
}

export async function verifyAccount(
  payload: VerifyAccountPayload,
): Promise<AuthSession> {
  const apiPayload: VerifyOtpApiPayload = {
    email: payload.email.trim().toLowerCase(),
    otp: payload.code,
    purpose: 'SIGNUP',
  };

  const response = await apiClient.post<ApiEnvelope<VerifyAccountApiData>>(
    '/auth/verify',
    apiPayload,
  );

  const { accessToken, user } = response.data.data;

  return {
    accessToken,
    // A verified email account goes straight to the app: the username and age
    // are optional details it can fill in later from the profile screen, so the
    // account is complete as far as the navigation guard is concerned.
    user: {
      ...mapBackendUser(user, 'learner'),
      profileCompleted: true,
    },
  };
}

/**
 * Turns a guest into a full account. Like signing up it only issues a code:
 * the guest keeps playing under the old session until `verifyCompleteProfile`
 * hands back credentials for the converted account.
 */
export async function completeProfile(
  payload: CompleteProfilePayload,
): Promise<void> {
  await apiClient.post<ApiEnvelope<CompleteProfileOtpApiData>>(
    '/auth/complete-profile',
    {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  );
}

export async function verifyCompleteProfile(
  payload: VerifyCompleteProfilePayload,
): Promise<AuthSession> {
  const apiPayload: VerifyOtpApiPayload = {
    email: payload.email.trim().toLowerCase(),
    otp: payload.code,
    purpose: 'COMPLETE_PROFILE',
  };

  const response = await apiClient.post<
    ApiEnvelope<VerifyCompleteProfileApiData>
  >('/auth/verify', apiPayload);

  const { accessToken, user } = response.data.data;

  return {
    accessToken,
    user: mapBackendUser(user, 'learner'),
  };
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

/**
 * Signing up does not open a session: the backend emails a one-time code and
 * only `verifyAccount` below hands back the credentials.
 */
export async function signUp(payload: SignUpPayload): Promise<void> {
  await apiClient.post<ApiEnvelope<SignUpOtpApiData>>('/auth/signup', {
    ...payload,
    email: payload.email.trim().toLowerCase(),
  });
}
