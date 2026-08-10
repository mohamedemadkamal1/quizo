import type {
  AudioPreferenceKey,
  AudioPreferences,
  SettingsIntegration,
} from '@/types/settings.types';

const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  musicVolume: 0.5,
  soundVolume: 0.7,
};

let temporaryAudioPreferences = { ...DEFAULT_AUDIO_PREFERENCES };

export class SettingsIntegrationUnavailableError extends Error {
  constructor(public readonly integration: SettingsIntegration) {
    super('This setting is not connected to the server yet.');
    this.name = 'SettingsIntegrationUnavailableError';
  }
}

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

export async function getAudioPreferences(): Promise<AudioPreferences> {
  return { ...temporaryAudioPreferences };
}

export async function saveAudioPreference(
  key: AudioPreferenceKey,
  value: number,
): Promise<void> {
  temporaryAudioPreferences = {
    ...temporaryAudioPreferences,
    [key]: clampVolume(value),
  };
}

export async function requestGuestAccountConversion(): Promise<never> {
  throw new SettingsIntegrationUnavailableError('account-conversion');
}

export async function requestPasswordChange(): Promise<never> {
  throw new SettingsIntegrationUnavailableError('change-password');
}

export async function updateDisplayName(): Promise<never> {
  throw new SettingsIntegrationUnavailableError('edit-display-name');
}

export async function deleteAccount(): Promise<never> {
  throw new SettingsIntegrationUnavailableError('delete-account');
}
