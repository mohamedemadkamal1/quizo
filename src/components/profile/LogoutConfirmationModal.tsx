import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import { useTranslation } from '@/hooks/useTranslation';

type LogoutConfirmationModalProps = {
  visible: boolean;
  isLoggingOut: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmationModal({
  visible,
  isLoggingOut,
  onCancel,
  onConfirm,
}: LogoutConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <ProfileModalFrame
      accessibilityLabel={t('profile.logoutModal.dialogLabel')}
      isBusy={isLoggingOut}
      maxWidth={420}
      onClose={onCancel}
      visible={visible}
    >
      <View style={styles.iconCircle}>
        <ProfileIcon name="logout" color="#FF3944" size={32} />
      </View>
      <AppText accessibilityRole="header" style={styles.title}>
        {t('profile.logoutModal.title')}
      </AppText>
      <AppText style={styles.body}>{t('profile.logoutModal.body')}</AppText>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: isLoggingOut, disabled: isLoggingOut }}
          disabled={isLoggingOut}
          onPress={onConfirm}
          style={[
            styles.button,
            styles.confirmButton,
            isLoggingOut && styles.disabled,
          ]}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <AppText numberOfLines={1} style={styles.confirmText}>
              {t('profile.logoutModal.confirm')}
            </AppText>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isLoggingOut}
          onPress={onCancel}
          style={[
            styles.button,
            styles.cancelButton,
            isLoggingOut && styles.disabled,
          ]}
        >
          <AppText numberOfLines={1} style={styles.cancelText}>
            {t('profile.logoutModal.cancel')}
          </AppText>
        </Pressable>
      </View>
    </ProfileModalFrame>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 76,
    height: 76,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
    backgroundColor: '#F8E3E6',
  },
  title: {
    marginTop: 26,
    color: '#111111',
    fontFamily: 'Fredoka',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 33,
    textAlign: 'center',
  },
  body: {
    marginTop: 18,
    color: '#737373',
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
    marginTop: 30,
  },
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 18,
  },
  confirmButton: {
    backgroundColor: '#FF3944',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F5F6FA',
  },
  confirmText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelText: {
    color: '#111111',
    fontFamily: 'Nunito',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
});
