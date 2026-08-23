import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileModalError } from '@/components/profile/ProfileModalElements';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import { useTranslation } from '@/hooks/useTranslation';

type DeleteProfileModalProps = {
  visible: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteProfileModal({
  visible,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteProfileModalProps) {
  const { t } = useTranslation();

  return (
    <ProfileModalFrame
      accessibilityLabel={t('profile.deleteModal.dialogLabel')}
      isBusy={isDeleting}
      maxWidth={430}
      onClose={onCancel}
      visible={visible}
    >
      <AppText accessibilityRole="header" style={styles.title}>
        {t('profile.deleteModal.title')}
      </AppText>
      <AppText style={styles.body}>{t('profile.deleteModal.body')}</AppText>
      <ProfileModalError message={errorMessage} />
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: isDeleting, disabled: isDeleting }}
          disabled={isDeleting}
          onPress={onConfirm}
          style={[
            styles.button,
            styles.deleteButton,
            isDeleting && styles.disabled,
          ]}
        >
          {isDeleting ? (
            <ActivityIndicator color="#C90D3D" />
          ) : (
            <AppText numberOfLines={1} style={styles.deleteText}>
              {t('profile.deleteModal.confirm')}
            </AppText>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isDeleting}
          onPress={onCancel}
          style={[
            styles.button,
            styles.cancelButton,
            isDeleting && styles.disabled,
          ]}
        >
          <AppText numberOfLines={1} style={styles.cancelText}>
            {t('profile.deleteModal.cancel')}
          </AppText>
        </Pressable>
      </View>
    </ProfileModalFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#C90D3D',
    fontFamily: 'Fredoka',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
    textAlign: 'center',
  },
  body: {
    marginTop: 20,
    color: '#747783',
    fontFamily: 'Nunito',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  actions: {
    alignItems: 'center',
    gap: 12,
    marginTop: 34,
  },
  button: {
    minWidth: 180,
    maxWidth: '100%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 22,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#F4CAD5',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#D60C3F',
  },
  deleteText: {
    color: '#C90D3D',
    fontFamily: 'Nunito',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
});
