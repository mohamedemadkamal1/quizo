import { z } from 'zod';

import { AVATAR_IDS } from '@/types/avatar.types';

export const PROFILE_PASSWORD_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';

export const PROFILE_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/;

export const profileEmailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .max(120, 'Email cannot exceed 120 characters.')
  .email('Enter a valid email address.');

const profilePasswordSchema = z
  .string()
  .min(1, 'Password is required.')
  .min(8, 'Password must contain at least 8 characters.')
  .max(128, 'Password cannot exceed 128 characters.')
  .regex(PROFILE_PASSWORD_REGEX, PROFILE_PASSWORD_MESSAGE);

export const profileUsernameSchema = z
  .string()
  .trim()
  .min(1, 'Username is required.')
  .max(200, 'Username cannot exceed 200 characters.');

export const editProfileSchema = z.object({
  username: profileUsernameSchema,
  avatar: z
    .enum(AVATAR_IDS)
    .nullable()
    .refine((avatar): boolean => avatar !== null, 'Choose an avatar.'),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const completeProfileSchema = z
  .object({
    email: profileEmailSchema,
    password: profilePasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: profilePasswordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      path: ['confirmNewPassword'],
      message: 'Passwords do not match.',
    },
  );

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
