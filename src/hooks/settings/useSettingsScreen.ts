import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteAccount,
  getAudioPreferences,
  requestGuestAccountConversion,
  requestPasswordChange,
  saveAudioPreference,
  SettingsIntegrationUnavailableError,
  updateDisplayName,
} from '@/services/settings.service';
import { useAuthStore } from '@/store/auth.store';
import type {
  AudioPreferenceKey,
  AudioPreferences,
  SettingsIntegration,
  SettingsProfileViewModel,
} from '@/types/settings.types';
import { getDisplayInitials } from '@/utils/settings-profile';

const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  musicVolume: 0.5,
  soundVolume: 0.7,
};

const unavailableMessages: Record<SettingsIntegration, string> = {
  'account-conversion':
    'Account conversion is not connected to the server yet.',
  'change-password':
    'In-account password changes are not connected to the server yet.',
  'delete-account':
    'Account deletion is not connected to the server yet. Your account is unchanged.',
  'edit-display-name':
    'Display-name editing is not connected to the server yet.',
};

function getActionError(error: unknown) {
  if (error instanceof SettingsIntegrationUnavailableError) {
    return unavailableMessages[error.integration];
  }

  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}

export function useSettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const [audioPreferences, setAudioPreferences] = useState(
    DEFAULT_AUDIO_PREFERENCES,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    void getAudioPreferences().then((preferences) => {
      if (isActive) {
        setAudioPreferences(preferences);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const profile = useMemo<SettingsProfileViewModel | null>(() => {
    if (!session) {
      return null;
    }

    const displayName = session.user.displayName?.trim() || 'Quizo Player';

    return {
      displayName,
      initials: getDisplayInitials(displayName),
      mode: session.user.role === 'guest' ? 'guest' : 'registered',
    };
  }, [session]);

  const runUnavailableAction = useCallback(
    async (action: () => Promise<never>) => {
      setErrorMessage(null);

      try {
        await action();
      } catch (error) {
        setErrorMessage(getActionError(error));
      }
    },
    [],
  );

  const onEditName = useCallback(() => {
    void runUnavailableAction(updateDisplayName);
  }, [runUnavailableAction]);

  const onCompleteProfile = useCallback(() => {
    void runUnavailableAction(requestGuestAccountConversion);
  }, [runUnavailableAction]);

  const onChangePassword = useCallback(() => {
    void runUnavailableAction(requestPasswordChange);
  }, [runUnavailableAction]);

  const onChangeAudioPreference = useCallback(
    (key: AudioPreferenceKey, value: number) => {
      setAudioPreferences((current) => ({ ...current, [key]: value }));
      void saveAudioPreference(key, value);
    },
    [],
  );

  const onLogOut = useCallback(() => {
    if (isLoggingOut) {
      return;
    }

    setLoggingOut(true);
    signOut();
  }, [isLoggingOut, signOut]);

  const onRequestDeleteAccount = useCallback(() => {
    setErrorMessage(null);
    setDeleteModalVisible(true);
  }, []);

  const onCancelDeleteAccount = useCallback(() => {
    if (!isDeleting) {
      setDeleteModalVisible(false);
    }
  }, [isDeleting]);

  const onConfirmDeleteAccount = useCallback(async () => {
    if (isDeleting) {
      return;
    }

    setDeleting(true);
    setErrorMessage(null);

    try {
      await deleteAccount();
      signOut();
    } catch (error) {
      setDeleteModalVisible(false);
      setErrorMessage(getActionError(error));
    } finally {
      setDeleting(false);
    }
  }, [isDeleting, signOut]);

  return {
    profile,
    audioPreferences,
    errorMessage,
    isDeleteModalVisible,
    isDeleting,
    isLoggingOut,
    tabBarHeight,
    onEditName,
    onCompleteProfile,
    onChangePassword,
    onChangeAudioPreference,
    onLogOut,
    onRequestDeleteAccount,
    onCancelDeleteAccount,
    onConfirmDeleteAccount,
  };
}
