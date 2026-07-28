import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  ApiEnvelope,
  AuthSession,
  EmailPayload,
  ResetPasswordPayload,
  SignInPayload,
  VerifyResetCodePayload,
} from '@/features/auth/types/auth.types';

const DEMO_EMAIL = 'learner@quizo.app';
const DEMO_OTP = '123456';

let demoPassword = 'Password123!';

const pendingResetEmails = new Set<string>();
const resetTokens = new Map<string, string>();

function parseBody<T>(data: unknown): T {
  if (typeof data === 'string') {
    return JSON.parse(data) as T;
  }

  return data as T;
}

function success<T>(data: T, message: string): ApiEnvelope<T> {
  return {
    data,
    message,
  };
}

export function installAuthMocks(api: AxiosInstance) {
  const mock = new MockAdapter(api, {
    delayResponse: 700,
  });

  mock.onPost('/auth/sign-in').reply((config) => {
    const body = parseBody<SignInPayload>(config.data);

    const isValid =
      body.email.toLowerCase() === DEMO_EMAIL && body.password === demoPassword;

    if (!isValid) {
      return [
        401,
        {
          message: 'Invalid email or password.',
          code: 'AUTH_INVALID_CREDENTIALS',
        },
      ];
    }

    const session: AuthSession = {
      accessToken: 'mock-learner-access-token',
      user: {
        id: 'learner-1',
        displayName: 'Demo Learner',
        email: DEMO_EMAIL,
        role: 'learner',
      },
    };

    return [200, success(session, 'Signed in successfully.')];
  });

  mock.onPost('/auth/guest').reply(() => {
    const session: AuthSession = {
      accessToken: `mock-guest-${Date.now()}`,
      user: {
        id: `guest-${Date.now()}`,
        displayName: 'Guest',
        email: null,
        role: 'guest',
      },
    };

    return [200, success(session, 'Guest session created.')];
  });

  mock.onPost('/auth/forgot-password').reply((config) => {
    const body = parseBody<EmailPayload>(config.data);
    const email = body.email.trim().toLowerCase();

    pendingResetEmails.add(email);

    return [
      200,
      success(
        null,
        'If an account exists for this email, a verification code was sent.',
      ),
    ];
  });

  mock.onPost('/auth/resend-reset-code').reply((config) => {
    const body = parseBody<EmailPayload>(config.data);
    const email = body.email.trim().toLowerCase();

    pendingResetEmails.add(email);

    return [200, success(null, 'A new code was sent.')];
  });

  mock.onPost('/auth/verify-reset-code').reply((config) => {
    const body = parseBody<VerifyResetCodePayload>(config.data);
    const email = body.email.trim().toLowerCase();

    if (!pendingResetEmails.has(email) || body.code !== DEMO_OTP) {
      return [
        400,
        {
          message: 'The verification code is invalid or expired.',
          code: 'AUTH_INVALID_RESET_CODE',
        },
      ];
    }

    const resetToken = `mock-reset-token-${Date.now()}`;

    pendingResetEmails.delete(email);
    resetTokens.set(resetToken, email);

    return [200, success({ resetToken }, 'Email verified successfully.')];
  });

  mock.onPost('/auth/reset-password').reply((config) => {
    const body = parseBody<ResetPasswordPayload>(config.data);
    const email = resetTokens.get(body.resetToken);

    if (!email) {
      return [
        401,
        {
          message: 'The password-reset session has expired.',
          code: 'AUTH_INVALID_RESET_TOKEN',
        },
      ];
    }

    if (email === DEMO_EMAIL) {
      demoPassword = body.newPassword;
    }

    resetTokens.delete(body.resetToken);

    return [200, success(null, 'Password reset successfully.')];
  });

  // Allow APIs that are not mocked to reach the real backend.
  mock.onAny().passThrough();
}
