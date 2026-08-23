import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguageSelection } from '@/hooks/useLanguageSelection';
import { useTranslation } from '@/hooks/useTranslation';
import {
  createProfileEmailSchema,
  createProfileUsernameSchema,
} from '@/schemas/profile.schemas';
import {
  changePassword,
  deleteProfile,
  getSoundPreferences,
  saveSoundPreference,
  updateProfile,
} from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';
import { isAvatarId, type AvatarId } from '@/types/avatar.types';
import type { ChangePasswordRequest } from '@/types/profile.types';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { getProfileInitials, mapProfileDataToAuthUser } from '@/utils/profile';

type ProfileModal =
  | 'edit-profile'
  | 'complete-profile'
  | 'change-password'
  | 'delete-profile'
  | 'logout';

export function useProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { presentLanguagePicker } = useLanguageSelection();
  const queryClient = useQueryClient();
  const tabBarHeight = useBottomTabBarHeight();
  const session = useAuthStore((state) => state.session);
  const replaceSessionUser = useAuthStore((state) => state.replaceSessionUser);
  const signOut = useAuthStore((state) => state.signOut);
  const [activeModal, setActiveModal] = useState<ProfileModal | null>(null);
  const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(
    null,
  );
  const [soundVolume, setSoundVolume] = useState(0.7);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [successFeedbackMessage, setSuccessFeedbackMessage] = useState<
    string | null
  >(null);
  const mountedRef = useRef(true);
  const updateLockedRef = useRef(false);
  const deleteLockedRef = useRef(false);
  const passwordLockedRef = useRef(false);
  const logoutLockedRef = useRef(false);
  const navigationLockedRef = useRef(false);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    retry: false,
  });
  const deleteProfileMutation = useMutation({
    mutationFn: deleteProfile,
    retry: false,
  });
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    retry: false,
  });

  useEffect(() => {
    let isActive = true;

    void getSoundPreferences().then((preferences) => {
      if (isActive) {
        setSoundVolume(preferences.soundVolume);
      }
    });

    return () => {
      isActive = false;
      mountedRef.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigationLockedRef.current = false;
    }, []),
  );

  const profile = useMemo(() => {
    if (!session) {
      return null;
    }

    const displayName =
      session.user.displayName?.trim() || t('profile.defaultName');

    return {
      displayName,
      currentUsername: session.user.displayName ?? '',
      initials: getProfileInitials(displayName),
      mode:
        session.user.role === 'guest'
          ? ('guest' as const)
          : ('registered' as const),
      avatar: session.user.avatar,
    };
  }, [session, t]);

  const openModal = useCallback(
    (modal: ProfileModal) => {
      if (activeModal !== null) {
        return;
      }

      setModalErrorMessage(null);
      setSuccessFeedbackMessage(null);
      updateProfileMutation.reset();
      deleteProfileMutation.reset();
      changePasswordMutation.reset();
      setActiveModal(modal);
    },
    [
      activeModal,
      changePasswordMutation,
      deleteProfileMutation,
      updateProfileMutation,
    ],
  );

  const isModalBusy =
    updateProfileMutation.isPending ||
    deleteProfileMutation.isPending ||
    changePasswordMutation.isPending ||
    isLoggingOut;

  const dismissModal = useCallback(() => {
    if (!isModalBusy) {
      setModalErrorMessage(null);
      setActiveModal(null);
    }
  }, [isModalBusy]);

  const submitEditedProfile = useCallback(
    async (username: string, avatar: AvatarId) => {
      if (
        updateLockedRef.current ||
        !session ||
        session.user.role !== 'learner'
      ) {
        return false;
      }

      updateLockedRef.current = true;
      setModalErrorMessage(null);

      try {
        const data = await updateProfileMutation.mutateAsync({
          username: username.trim(),
          avatar,
        });

        const validUsername = createProfileUsernameSchema(t).safeParse(
          data.username,
        );

        if (!validUsername.success) {
          throw new Error(t('profile.errors.missingUsername'));
        }

        if (!isAvatarId(data.avatar)) {
          throw new Error(t('profile.errors.missingAvatar'));
        }

        if (!mountedRef.current) {
          return false;
        }

        replaceSessionUser(
          mapProfileDataToAuthUser(
            { ...data, username: validUsername.data },
            'learner',
          ),
        );
        setActiveModal(null);
        return true;
      } catch (error) {
        if (mountedRef.current) {
          setModalErrorMessage(
            getApiErrorMessage(error, t('profile.errors.updateProfile')),
          );
        }
        return false;
      } finally {
        updateLockedRef.current = false;
      }
    },
    [replaceSessionUser, session, t, updateProfileMutation],
  );

  const submitGuestConversion = useCallback(
    async (email: string, password: string) => {
      if (
        updateLockedRef.current ||
        !session ||
        session.user.role !== 'guest'
      ) {
        return false;
      }

      updateLockedRef.current = true;
      setModalErrorMessage(null);

      try {
        const data = await updateProfileMutation.mutateAsync({
          email: email.trim().toLowerCase(),
          password,
        });
        const validEmail = createProfileEmailSchema(t).safeParse(data.email);

        if (!data.profileCompleted || !validEmail.success) {
          throw new Error(t('profile.errors.missingEmail'));
        }

        if (!mountedRef.current) {
          return false;
        }

        replaceSessionUser(mapProfileDataToAuthUser(data, 'learner'));
        setActiveModal(null);
        return true;
      } catch (error) {
        if (mountedRef.current) {
          setModalErrorMessage(
            getApiErrorMessage(error, t('profile.errors.completeProfile')),
          );
        }
        return false;
      } finally {
        updateLockedRef.current = false;
      }
    },
    [replaceSessionUser, session, t, updateProfileMutation],
  );

  const submitPasswordChange = useCallback(
    async (payload: ChangePasswordRequest) => {
      if (passwordLockedRef.current) {
        return false;
      }

      passwordLockedRef.current = true;
      setModalErrorMessage(null);

      try {
        await changePasswordMutation.mutateAsync({
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
        });

        if (!mountedRef.current) {
          return false;
        }

        setModalErrorMessage(null);
        setActiveModal(null);
        setSuccessFeedbackMessage(t('profile.passwordChanged'));
        return true;
      } catch (error) {
        if (mountedRef.current) {
          setModalErrorMessage(
            getApiErrorMessage(error, t('profile.errors.changePassword')),
          );
        }
        return false;
      } finally {
        passwordLockedRef.current = false;
      }
    },
    [changePasswordMutation, t],
  );

  const confirmDeleteProfile = useCallback(async () => {
    if (deleteLockedRef.current || !session) {
      return;
    }

    deleteLockedRef.current = true;
    setModalErrorMessage(null);

    try {
      await deleteProfileMutation.mutateAsync();
      await queryClient.cancelQueries();
      queryClient.clear();
      signOut();
    } catch (error) {
      if (mountedRef.current) {
        setModalErrorMessage(
          getApiErrorMessage(error, t('profile.errors.deleteAccount')),
        );
      }
    } finally {
      deleteLockedRef.current = false;
    }
  }, [deleteProfileMutation, queryClient, session, signOut, t]);

  const confirmLogout = useCallback(async () => {
    if (logoutLockedRef.current) {
      return;
    }

    logoutLockedRef.current = true;
    setLoggingOut(true);

    await queryClient.cancelQueries();
    queryClient.clear();
    signOut();
  }, [queryClient, signOut]);

  const navigateToProgress = useCallback(() => {
    if (navigationLockedRef.current) {
      return;
    }

    navigationLockedRef.current = true;
    router.push('/(tabs)/profile/progress');
  }, [router]);

  const changeSoundVolume = useCallback((value: number) => {
    const normalized = Math.min(1, Math.max(0, value));
    setSoundVolume(normalized);
    void saveSoundPreference(normalized);
  }, []);

  return {
    profile,
    soundVolume,
    tabBarHeight,
    modalErrorMessage,
    successFeedbackMessage,
    isEditProfileModalVisible: activeModal === 'edit-profile',
    isCompleteProfileModalVisible: activeModal === 'complete-profile',
    isChangePasswordModalVisible: activeModal === 'change-password',
    isDeleteProfileModalVisible: activeModal === 'delete-profile',
    isLogoutModalVisible: activeModal === 'logout',
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isDeletingProfile: deleteProfileMutation.isPending,
    isLoggingOut,
    onEditProfile: () => openModal('edit-profile'),
    onCompleteProfile: () => openModal('complete-profile'),
    onChangePassword: () => openModal('change-password'),
    onRequestDeleteProfile: () => openModal('delete-profile'),
    onRequestLogout: () => openModal('logout'),
    onDismissModal: dismissModal,
    onSubmitEditedProfile: submitEditedProfile,
    onSubmitGuestConversion: submitGuestConversion,
    onSubmitPasswordChange: submitPasswordChange,
    onConfirmDeleteProfile: confirmDeleteProfile,
    onConfirmLogout: confirmLogout,
    onNavigateToProgress: navigateToProgress,
    onChangeSoundVolume: changeSoundVolume,
    onChangeLanguage: presentLanguagePicker,
  };
}
