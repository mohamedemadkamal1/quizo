import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from '@/hooks/useTranslation';
import { createProfileUsernameSchema } from '@/schemas/profile.schemas';
import { completeProfile } from '@/services/auth.service';
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
  const queryClient = useQueryClient();
  const tabBarHeight = useBottomTabBarHeight();
  const session = useAuthStore((state) => state.session);
  const replaceSessionUser = useAuthStore((state) => state.replaceSessionUser);
  const verifyCompleteProfile = useAuthStore(
    (state) => state.verifyCompleteProfile,
  );
  const signOut = useAuthStore((state) => state.signOut);
  const [activeModal, setActiveModal] = useState<ProfileModal | null>(null);
  // Set once the conversion code has been sent, which is also what switches
  // the complete-profile modal over to its code step.
  const [pendingConversionEmail, setPendingConversionEmail] = useState<
    string | null
  >(null);
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
  const completeProfileMutation = useMutation({
    mutationFn: completeProfile,
    retry: false,
  });
  const verifyCompleteProfileMutation = useMutation({
    mutationFn: verifyCompleteProfile,
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
      setPendingConversionEmail(null);
      updateProfileMutation.reset();
      deleteProfileMutation.reset();
      changePasswordMutation.reset();
      completeProfileMutation.reset();
      verifyCompleteProfileMutation.reset();
      setActiveModal(modal);
    },
    [
      activeModal,
      changePasswordMutation,
      completeProfileMutation,
      deleteProfileMutation,
      updateProfileMutation,
      verifyCompleteProfileMutation,
    ],
  );

  const isModalBusy =
    updateProfileMutation.isPending ||
    deleteProfileMutation.isPending ||
    changePasswordMutation.isPending ||
    completeProfileMutation.isPending ||
    verifyCompleteProfileMutation.isPending ||
    isLoggingOut;

  const dismissModal = useCallback(() => {
    if (!isModalBusy) {
      setModalErrorMessage(null);
      setPendingConversionEmail(null);
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
        const normalizedEmail = email.trim().toLowerCase();

        await completeProfileMutation.mutateAsync({
          email: normalizedEmail,
          password,
        });

        if (!mountedRef.current) {
          return false;
        }

        // The account is not converted yet: this only moves the modal on to
        // the code that was just emailed.
        setPendingConversionEmail(normalizedEmail);
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
    [completeProfileMutation, session, t],
  );

  const submitGuestConversionCode = useCallback(
    async (code: string) => {
      if (updateLockedRef.current || !pendingConversionEmail) {
        return false;
      }

      updateLockedRef.current = true;
      setModalErrorMessage(null);

      try {
        await verifyCompleteProfileMutation.mutateAsync({
          email: pendingConversionEmail,
          code,
        });

        if (!mountedRef.current) {
          return false;
        }

        setPendingConversionEmail(null);
        setActiveModal(null);
        return true;
      } catch (error) {
        if (mountedRef.current) {
          setModalErrorMessage(
            getApiErrorMessage(error, t('auth.errors.verifyCodeFailed')),
          );
        }
        return false;
      } finally {
        updateLockedRef.current = false;
      }
    },
    [pendingConversionEmail, t, verifyCompleteProfileMutation],
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

  const confirmDeleteProfile = useCallback(
    async (reason: string) => {
      if (deleteLockedRef.current || !session) {
        return;
      }

      const trimmedReason = reason.trim();

      if (!trimmedReason) {
        setModalErrorMessage(t('profile.deleteModal.reasonRequired'));
        return;
      }

      deleteLockedRef.current = true;
      setModalErrorMessage(null);

      try {
        await deleteProfileMutation.mutateAsync({ reason: trimmedReason });
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
    },
    [deleteProfileMutation, queryClient, session, signOut, t],
  );

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
    isCompletingProfile:
      completeProfileMutation.isPending ||
      verifyCompleteProfileMutation.isPending,
    completeProfilePendingEmail: pendingConversionEmail,
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
    onSubmitGuestConversionCode: submitGuestConversionCode,
    onSubmitPasswordChange: submitPasswordChange,
    onConfirmDeleteProfile: confirmDeleteProfile,
    onConfirmLogout: confirmLogout,
    onNavigateToProgress: navigateToProgress,
    onChangeSoundVolume: changeSoundVolume,
  };
}
