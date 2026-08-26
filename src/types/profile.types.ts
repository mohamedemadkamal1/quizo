import type { AvatarId } from '@/types/avatar.types';

export type ProfileUserMode = 'guest' | 'registered';

export type ProfileViewModel = {
  displayName: string;
  currentUsername: string;
  initials: string;
  mode: ProfileUserMode;
  avatar: AvatarId | null;
};

export type UpdateProfileRequest = {
  email?: string;
  username?: string;
  age?: number;
  password?: string;
  avatar?: AvatarId;
};

export type UpdateProfileData = {
  id: number;
  username: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  age: number | null;
  profileCompleted: boolean;
  avatar: AvatarId | null;
};

export type UpdateProfileApiResponse = {
  success: true;
  statusCode: 200;
  data: UpdateProfileData;
};

export type DeleteProfileRequest = {
  reason: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordApiResponse = {
  success: true;
  statusCode: 200;
};
