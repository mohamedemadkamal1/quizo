import type { AvatarId } from '@/types/avatar.types';

export type AuthUser = {
  id: string;
  displayName: string | null;
  email: string | null;
  age: number | null;
  role: 'learner' | 'guest';
  profileCompleted: boolean;
  avatar: AvatarId | null;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  signupType: 'ACCOUNT';
  email: string;
  password: string;
};

export type SignUpApiData = {
  accessToken: string;
  user: BackendAuthUserDto;
};

export type SignUpOtpApiData = {
  message?: string;
};

export type SignInApiData = {
  accessToken: string;
  user: BackendAuthUserDto;
};

export type GuestProfilePayload = {
  nickname: string;
  age: number;
};

export type BackendAuthUserDto = {
  id: number;
  username: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  age: number | null;
  profileCompleted: boolean;
  avatar: AvatarId | null;
};

export type GuestSignUpApiPayload = {
  signupType: 'GUEST';
  username: string;
  age: number;
};

export type EmailPayload = {
  email: string;
};

export type VerifyResetCodePayload = {
  email: string;
  code: string;
};

export type VerifyAccountPayload = {
  email: string;
  code: string;
};

export type CompleteProfilePayload = {
  email: string;
  password: string;
};

export type VerifyCompleteProfilePayload = {
  email: string;
  code: string;
};

/**
 * `/auth/verify` backs every one-time code the backend issues, so the purpose
 * is what tells it which flow the code was sent for.
 */
export type OtpPurpose =
  | 'PASSWORD_RESET'
  | 'SIGNUP'
  | 'COMPLETE_PROFILE'
  | 'CHANGE_EMAIL';

export type VerifyOtpApiPayload = {
  email: string;
  otp: string;
  purpose: OtpPurpose;
};

export type VerifyResetOtpApiData = {
  resetToken: string;
  expiresIn: number;
};

export type VerifyAccountApiData = {
  accessToken: string;
  user: BackendAuthUserDto;
};

export type CompleteProfileOtpApiData = {
  message?: string;
};

/**
 * Converting a guest issues fresh credentials, because the role on the token
 * changes along with the account.
 */
export type VerifyCompleteProfileApiData = {
  accessToken: string;
  user: BackendAuthUserDto;
};

export type ResetPasswordPayload = {
  resetToken: string;
  password: string;
};

export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
};
