import type { AuthUser } from '@/types/auth.types';
import type { UpdateProfileData } from '@/types/profile.types';

export function getProfileInitials(displayName: string | null | undefined) {
  const words = displayName?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length === 0) {
    return 'Q';
  }

  const selectedWords = words.length === 1 ? words : [words[0], words.at(-1)!];

  return selectedWords
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toLocaleUpperCase();
}

export function mapProfileDataToAuthUser(
  data: UpdateProfileData,
  role: AuthUser['role'],
): AuthUser {
  return {
    id: String(data.id),
    displayName: data.username,
    email: data.email,
    age: data.age,
    role,
    profileCompleted: data.profileCompleted,
    avatar: data.avatar,
  };
}

export function getSafeNonNegativeValue(value: number) {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
