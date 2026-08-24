import { apiClient } from '@/services/api/api-client';
import { normalizeAvatarId } from '@/types/avatar.types';
import type {
  ChangePasswordApiResponse,
  ChangePasswordRequest,
  DeleteProfileRequest,
  SoundPreferences,
  UpdateProfileData,
  UpdateProfileRequest,
} from '@/types/profile.types';

const DEFAULT_SOUND_PREFERENCES: SoundPreferences = {
  soundVolume: 0.7,
};

let temporarySoundPreferences = { ...DEFAULT_SOUND_PREFERENCES };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseUpdateProfileResponse(value: unknown): UpdateProfileData {
  if (
    !isRecord(value) ||
    value.success !== true ||
    value.statusCode !== 200 ||
    !isRecord(value.data)
  ) {
    throw new Error('The profile response is malformed.');
  }

  const { id, username, email, role, age, profileCompleted, avatar } =
    value.data;

  if (
    typeof id !== 'number' ||
    !Number.isInteger(id) ||
    id <= 0 ||
    (typeof username !== 'string' && username !== null) ||
    (typeof email !== 'string' && email !== null) ||
    (role !== 'USER' && role !== 'ADMIN') ||
    (age !== null && (typeof age !== 'number' || !Number.isInteger(age))) ||
    typeof profileCompleted !== 'boolean'
  ) {
    throw new Error('The profile response contains invalid user data.');
  }

  return {
    id,
    username,
    email,
    role,
    age,
    profileCompleted,
    avatar: normalizeAvatarId(avatar),
  };
}

export async function updateProfile(
  payload: UpdateProfileRequest,
): Promise<UpdateProfileData> {
  const hasValue = Object.values(payload).some((value) => value !== undefined);

  if (!hasValue) {
    throw new Error('At least one profile field is required.');
  }

  const response = await apiClient.put<unknown>('/auth/profile', payload);

  return parseUpdateProfileResponse(response.data);
}

export async function deleteProfile(
  payload: DeleteProfileRequest,
): Promise<void> {
  const reason = payload.reason.trim();

  if (!reason) {
    throw new Error('A reason is required to delete an account.');
  }

  // Axios only sends a body on DELETE when it is passed as `data`.
  await apiClient.delete('/auth/profile', { data: { reason } });
}

function parseChangePasswordResponse(
  value: unknown,
): ChangePasswordApiResponse {
  if (!isRecord(value) || value.success !== true || value.statusCode !== 200) {
    throw new Error('The change password response is malformed.');
  }

  return {
    success: true,
    statusCode: 200,
  };
}

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<void> {
  const response = await apiClient.post<unknown>('/auth/change-password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });

  parseChangePasswordResponse(response.data);
}

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

export async function getSoundPreferences(): Promise<SoundPreferences> {
  return { ...temporarySoundPreferences };
}

export async function saveSoundPreference(value: number): Promise<void> {
  temporarySoundPreferences = {
    soundVolume: clampVolume(value),
  };
}
