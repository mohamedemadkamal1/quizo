export const AVATAR_IDS = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
  'avatar-7',
  'avatar-8',
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

export function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === 'string' && AVATAR_IDS.includes(value as AvatarId);
}

export function normalizeAvatarId(value: unknown): AvatarId | null {
  if (isAvatarId(value)) {
    return value;
  }

  if (value !== null && value !== undefined && __DEV__) {
    console.warn('Received an unrecognized profile avatar identifier.');
  }

  return null;
}
