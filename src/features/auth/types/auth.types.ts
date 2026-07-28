export type AuthUser = {
  id: string;
  displayName: string;
  email: string | null;
  role: 'learner' | 'guest';
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type EmailPayload = {
  email: string;
};

export type VerifyResetCodePayload = {
  email: string;
  code: string;
};

export type ResetPasswordPayload = {
  resetToken: string;
  newPassword: string;
};

export type ApiEnvelope<T> = {
  data: T;
  message: string;
};
