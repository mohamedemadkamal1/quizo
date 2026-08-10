import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsIcon } from '@/components/settings/SettingsIcon';
import { SettingsText as Text } from '@/components/settings/SettingsText';
import { colors } from '@/constants/colors';

type DeleteAccountModalProps = {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteAccountModal({
  visible,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteAccountModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={isDeleting ? undefined : onCancel}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <SafeAreaView style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          accessibilityLabel="Delete account confirmation"
          style={styles.dialog}
        >
          <View style={styles.iconCircle}>
            <SettingsIcon
              name="trash"
              color={colors.settings.coral}
              size={28}
            />
          </View>

          <Text accessibilityRole="header" style={styles.title}>
            Delete your account?
          </Text>
          <Text style={styles.body}>
            Your profile and saved progress would be permanently removed. This
            action cannot be undone.
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isDeleting}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ busy: isDeleting, disabled: isDeleting }}
              disabled={isDeleting}
              onPress={onConfirm}
              style={[styles.button, styles.deleteButton]}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.settings.modalBackdrop,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  iconCircle: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: colors.settings.coralSoft,
  },
  title: {
    marginTop: 16,
    color: colors.settings.heading,
    fontFamily: 'Fredoka',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 27,
    textAlign: 'center',
  },
  body: {
    marginTop: 8,
    color: colors.settings.body,
    fontFamily: 'Nunito',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  button: {
    height: 46,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
  },
  cancelButton: {
    backgroundColor: colors.settings.violetSoft,
  },
  deleteButton: {
    backgroundColor: colors.settings.coral,
  },
  cancelText: {
    color: colors.settings.violet,
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
  },
});
