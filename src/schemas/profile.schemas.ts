import { z } from 'zod';

import type { Translate } from '@/i18n';
import { AVATAR_IDS } from '@/types/avatar.types';

export const PROFILE_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/;

export function createProfileEmailSchema(t: Translate) {
  return z
    .string()
    .trim()
    .min(1, t('validation.emailRequired'))
    .max(120, t('validation.emailTooLong'))
    .email(t('validation.emailInvalid'));
}

function createProfilePasswordSchema(t: Translate) {
  return z
    .string()
    .min(1, t('validation.passwordRequired'))
    .min(8, t('validation.passwordMin'))
    .max(128, t('validation.passwordMax'))
    .regex(PROFILE_PASSWORD_REGEX, t('validation.passwordComplexity'));
}

export function createProfileUsernameSchema(t: Translate) {
  return z
    .string()
    .trim()
    .min(1, t('validation.usernameRequired'))
    .max(200, t('validation.usernameMax'));
}

export function createEditProfileSchema(t: Translate) {
  return z.object({
    username: createProfileUsernameSchema(t),
    avatar: z
      .enum(AVATAR_IDS)
      .nullable()
      .refine(
        (avatar): boolean => avatar !== null,
        t('validation.avatarRequired'),
      ),
  });
}

export type EditProfileFormValues = z.infer<
  ReturnType<typeof createEditProfileSchema>
>;

export function createCompleteProfileSchema(t: Translate) {
  return z
    .object({
      email: createProfileEmailSchema(t),
      password: createProfilePasswordSchema(t),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired')),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ['confirmPassword'],
      message: t('validation.passwordsMismatch'),
    });
}

export type CompleteProfileFormValues = z.infer<
  ReturnType<typeof createCompleteProfileSchema>
>;

export function createChangePasswordSchema(t: Translate) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t('validation.currentPasswordRequired')),
      newPassword: createProfilePasswordSchema(t),
      confirmNewPassword: z
        .string()
        .min(1, t('validation.confirmNewPasswordRequired')),
    })
    .refine(
      ({ newPassword, confirmNewPassword }) =>
        newPassword === confirmNewPassword,
      {
        path: ['confirmNewPassword'],
        message: t('validation.passwordsMismatch'),
      },
    );
}

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
