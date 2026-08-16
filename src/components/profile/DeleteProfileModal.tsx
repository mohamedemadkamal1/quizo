import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProfileModalError } from '@/components/profile/ProfileModalElements';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';

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
  return (
    <ProfileModalFrame
      accessibilityLabel="Delete account confirmation"
      isBusy={isDeleting}
      maxWidth={430}
      onClose={onCancel}
      visible={visible}
    >
      <Text accessibilityRole="header" style={styles.title}>
        Delete User
      </Text>
      <Text style={styles.body}>
        Are you sure you want to delete your account? This action cannot be
        undone and all data will be permanently removed.
      </Text>
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
            <Text style={styles.deleteText}>Delete Account</Text>
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
          <Text style={styles.cancelText}>Cancel</Text>
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
  },
  cancelText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 17,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.55,
  },
});
