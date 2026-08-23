import { z } from 'zod';

import type { Translate } from '@/i18n';

/**
 * Schema factories rather than module-level schemas: a validation message has
 * to be produced in the language that is active when the form renders, which a
 * schema built once at import time could never do.
 */

function createEmailSchema(t: Translate) {
  return z
    .string()
    .trim()
    .min(1, t('validation.emailRequired'))
    .email(t('validation.emailInvalid'));
}

export function createSignInSchema(t: Translate) {
  return z.object({
    email: createEmailSchema(t),
    password: z.string().min(1, t('validation.passwordRequired')),
  });
}

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>;

export function createForgotPasswordSchema(t: Translate) {
  return z.object({
    email: createEmailSchema(t),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function createNewPasswordSchema(t: Translate) {
  return z
    .object({
      password: z.string().min(8, t('validation.passwordMin')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired')),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ['confirmPassword'],
      message: t('validation.passwordsMismatch'),
    });
}

export type NewPasswordFormValues = z.infer<
  ReturnType<typeof createNewPasswordSchema>
>;

export function createSignUpSchema(t: Translate) {
  return z
    .object({
      email: createEmailSchema(t),
      password: z.string().min(8, t('validation.passwordMin')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired')),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ['confirmPassword'],
      message: t('validation.passwordsMismatch'),
    });
}

export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>;

export function createGuestProfileSchema(t: Translate) {
  return z
    .object({
      nickname: z
        .string()
        .trim()
        .min(1, t('validation.nicknameRequired'))
        .max(24, t('validation.nicknameMax')),

      age: z.string().trim().min(1, t('validation.ageRequired')),
    })
    .superRefine(({ age }, context) => {
      if (!/^\d+$/.test(age)) {
        context.addIssue({
          code: 'custom',
          path: ['age'],
          message: t('validation.ageWholeNumber'),
        });

        return;
      }

      const numericAge = Number(age);

      if (numericAge < 1 || numericAge > 120) {
        context.addIssue({
          code: 'custom',
          path: ['age'],
          message: t('validation.ageRange'),
        });
      }
    });
}

export type GuestProfileFormValues = z.infer<
  ReturnType<typeof createGuestProfileSchema>
>;
