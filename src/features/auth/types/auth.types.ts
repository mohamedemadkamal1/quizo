export type AuthUser = {
  id: string;
  displayName: string | null;
  email: string | null;
  age: number | null;
  role: 'learner' | 'guest';
  profileCompleted: boolean;
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
};

export type GuestSignUpApiPayload = {
  signupType: 'GUEST';
  username: string;
  age: number;
};

export type CompleteAccountProfileApiPayload = {
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

export type VerifyOtpApiPayload = {
  email: string;
  otp: string;
};

export type VerifyOtpApiData = {
  resetToken: string;
  expiresIn: number;
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
