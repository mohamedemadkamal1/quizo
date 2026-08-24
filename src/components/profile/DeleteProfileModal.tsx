import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ProfileModalError } from '@/components/profile/ProfileModalElements';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import { useTranslation } from '@/hooks/useTranslation';

type DeleteProfileModalProps = {
  visible: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export function DeleteProfileModal({
  visible,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteProfileModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const canDelete = reason.trim().length > 0;

  // Cancelling is the only way out that keeps the screen mounted, so it is
  // also where the typed reason is dropped.
  const cancel = () => {
    setReason('');
    onCancel();
  };

  return (
    <ProfileModalFrame
      accessibilityLabel={t('profile.deleteModal.dialogLabel')}
      isBusy={isDeleting}
      maxWidth={430}
      onClose={cancel}
      visible={visible}
    >
      <AppText accessibilityRole="header" style={styles.title}>
        {t('profile.deleteModal.title')}
      </AppText>
      <AppText style={styles.body}>{t('profile.deleteModal.body')}</AppText>

      <AppText style={styles.reasonLabel}>
        {t('profile.deleteModal.reasonLabel')}
      </AppText>
      <AppTextInput
        accessibilityLabel={t('profile.deleteModal.reasonLabel')}
        editable={!isDeleting}
        maxLength={500}
        multiline
        onChangeText={setReason}
        placeholder={t('profile.deleteModal.reasonPlaceholder')}
        placeholderTextColor="#9CA3AF"
        style={[styles.reasonInput, isDeleting && styles.disabled]}
        textAlignVertical="top"
        value={reason}
      />

      <ProfileModalError message={errorMessage} />
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            busy: isDeleting,
            disabled: isDeleting || !canDelete,
          }}
          disabled={isDeleting || !canDelete}
          onPress={() => onConfirm(reason)}
          style={[
            styles.button,
            styles.deleteButton,
            (isDeleting || !canDelete) && styles.disabled,
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
          onPress={cancel}
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
  reasonLabel: {
    marginTop: 24,
    color: '#4B5563',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  reasonInput: {
    minHeight: 96,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    color: '#374151',
    fontFamily: 'Nunito',
    fontSize: 15,
    lineHeight: 21,
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
