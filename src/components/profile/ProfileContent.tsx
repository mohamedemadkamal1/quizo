import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';
import { CompleteProfileModal } from '@/components/profile/CompleteProfileModal';
import { DeleteProfileModal } from '@/components/profile/DeleteProfileModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { LogoutConfirmationModal } from '@/components/profile/LogoutConfirmationModal';
import {
  GuestProfileActions,
  LanguageAction,
  LogoutAction,
  ProgressAction,
  RegisteredProfileActions,
  SupportAction,
} from '@/components/profile/ProfileActions';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSoundControl } from '@/components/profile/ProfileSoundControl';
import { colors } from '@/constants/colors';
import type { useProfileScreen } from '@/hooks/profile/useProfileScreen';

type ProfileContentProps = {
  screen: ReturnType<typeof useProfileScreen>;
};

export function ProfileContent({ screen }: ProfileContentProps) {
  if (!screen.profile) {
    return <SafeAreaView style={styles.safeArea} />;
  }

  const isGuest = screen.profile.mode === 'guest';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundShapeTop} />
      <View pointerEvents="none" style={styles.backgroundShapeBottom} />
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: screen.tabBarHeight + 26,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          onEditProfile={screen.onEditProfile}
          profile={screen.profile}
        />

        <View style={[styles.content, isGuest && styles.guestContent]}>
          {isGuest ? (
            <>
              <GuestProfileActions
                onCompleteProfile={screen.onCompleteProfile}
              />
              <ProfileSoundControl
                enabled={screen.soundEnabled}
                onChange={screen.onChangeSoundEnabled}
              />
              <ProgressAction onPress={screen.onNavigateToProgress} />
              <LanguageAction />
              <SupportAction />
              <LogoutAction onPress={screen.onRequestLogout} />
            </>
          ) : (
            <>
              <ProfileSoundControl
                enabled={screen.soundEnabled}
                onChange={screen.onChangeSoundEnabled}
              />
              <ProgressAction onPress={screen.onNavigateToProgress} />
              <RegisteredProfileActions
                onChangePassword={screen.onChangePassword}
                onDeleteProfile={screen.onRequestDeleteProfile}
                onLogout={screen.onRequestLogout}
              />
            </>
          )}

          {screen.successFeedbackMessage ? (
            <AppText
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
              style={styles.successFeedback}
            >
              {screen.successFeedbackMessage}
            </AppText>
          ) : null}
        </View>
      </ScrollView>

      <EditProfileModal
        currentAvatar={screen.profile.avatar}
        currentUsername={screen.profile.currentUsername}
        errorMessage={screen.modalErrorMessage}
        isSubmitting={screen.isUpdatingProfile}
        onDismiss={screen.onDismissModal}
        onSubmit={screen.onSubmitEditedProfile}
        visible={screen.isEditProfileModalVisible}
      />
      <CompleteProfileModal
        errorMessage={screen.modalErrorMessage}
        isSubmitting={screen.isCompletingProfile}
        onDismiss={screen.onDismissModal}
        onSubmit={screen.onSubmitGuestConversion}
        onSubmitCode={screen.onSubmitGuestConversionCode}
        pendingEmail={screen.completeProfilePendingEmail}
        visible={screen.isCompleteProfileModalVisible}
      />
      <ChangePasswordModal
        errorMessage={screen.modalErrorMessage}
        isSubmitting={screen.isChangingPassword}
        onDismiss={screen.onDismissModal}
        onSubmit={screen.onSubmitPasswordChange}
        visible={screen.isChangePasswordModalVisible}
      />
      <DeleteProfileModal
        errorMessage={screen.modalErrorMessage}
        isDeleting={screen.isDeletingProfile}
        onCancel={screen.onDismissModal}
        onConfirm={screen.onConfirmDeleteProfile}
        visible={screen.isDeleteProfileModalVisible}
      />
      <LogoutConfirmationModal
        isLoggingOut={screen.isLoggingOut}
        onCancel={screen.onDismissModal}
        onConfirm={screen.onConfirmLogout}
        visible={screen.isLogoutModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.settings.background,
  },
  backgroundShapeTop: {
    position: 'absolute',
    top: 168,
    right: -86,
    width: 210,
    height: 230,
    borderRadius: 100,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    transform: [{ rotate: '-14deg' }],
  },
  backgroundShapeBottom: {
    position: 'absolute',
    right: -65,
    bottom: 35,
    width: 190,
    height: 240,
    borderRadius: 90,
    backgroundColor: 'rgba(167, 139, 250, 0.11)',
    transform: [{ rotate: '18deg' }],
  },
  content: {
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  guestContent: {
    gap: 10,
  },
  successFeedback: {
    color: '#15803D',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
});
