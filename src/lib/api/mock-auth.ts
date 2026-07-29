import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  ApiEnvelope,
  AuthSession,
  EmailPayload,
  GuestProfilePayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  VerifyResetCodePayload,
} from '@/features/auth/types/auth.types';

const DEMO_EMAIL = 'learner@quizo.app';
const DEMO_OTP = '123456';

type MockAccount = {
  id: string;
  email: string;
  password: string;
  displayName: string;
};

const accounts = new Map<string, MockAccount>([
  [
    DEMO_EMAIL,
    {
      id: 'learner-1',
      email: DEMO_EMAIL,
      password: 'Password123!',
      displayName: 'Demo Learner',
    },
  ],
]);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createLearnerSession(account: MockAccount): AuthSession {
  return {
    accessToken: `mock-learner-${account.id}-${Date.now()}`,
    user: {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      age: null,
      role: 'learner',
    },
  };
}

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
    const email = normalizeEmail(body.email);
    const account = accounts.get(email);

    if (!account || account.password !== body.password) {
      return [
        401,
        {
          message: 'Invalid email or password.',
          code: 'AUTH_INVALID_CREDENTIALS',
        },
      ];
    }

    return [
      200,
      success(createLearnerSession(account), 'Signed in successfully.'),
    ];
  });

  mock.onPost('/auth/sign-up').reply((config) => {
    const body = parseBody<SignUpPayload>(config.data);
    const email = normalizeEmail(body.email);

    if (accounts.has(email)) {
      return [
        409,
        {
          message: 'An account with this email already exists.',
          code: 'AUTH_EMAIL_ALREADY_EXISTS',
        },
      ];
    }

    const account: MockAccount = {
      id: `learner-${Date.now()}`,
      email,
      password: body.password,
      displayName: email.split('@')[0] || 'Learner',
    };

    accounts.set(email, account);

    return [
      201,
      success(createLearnerSession(account), 'Account created successfully.'),
    ];
  });
  mock.onPost('/auth/guest').reply((config) => {
    const body = parseBody<GuestProfilePayload>(config.data);

    const guestId = `guest-${Date.now()}`;

    const session: AuthSession = {
      accessToken: `mock-${guestId}`,
      user: {
        id: guestId,
        displayName: body.nickname?.trim() || 'Guest',
        email: null,
        age: body.age,
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

    const account = accounts.get(email);

    if (account) {
      accounts.set(email, {
        ...account,
        password: body.newPassword,
      });
    }
    resetTokens.delete(body.resetToken);

    return [200, success(null, 'Password reset successfully.')];
  });

  // Allow APIs that are not mocked to reach the real backend.
  mock.onAny().passThrough();
}
