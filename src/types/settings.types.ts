export type SettingsUserMode = 'guest' | 'registered';

export type AudioPreferenceKey = 'musicVolume' | 'soundVolume';

export type AudioPreferences = Record<AudioPreferenceKey, number>;

export type SettingsProfileViewModel = {
  displayName: string;
  initials: string;
  mode: SettingsUserMode;
};

export type SettingsIntegration =
  | 'account-conversion'
  | 'change-password'
  | 'delete-account'
  | 'edit-display-name';
