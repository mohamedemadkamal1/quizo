import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';

type ProfileModalFrameProps = PropsWithChildren<{
  visible: boolean;
  isBusy: boolean;
  accessibilityLabel: string;
  onClose: () => void;
  maxWidth?: number;
}>;

export function ProfileModalFrame({
  visible,
  isBusy,
  accessibilityLabel,
  onClose,
  maxWidth = 390,
  children,
}: ProfileModalFrameProps) {
  const { directionStyle } = useLanguageDirection();

  return (
    <Modal
      animationType="fade"
      onRequestClose={isBusy ? undefined : onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <SafeAreaView style={[styles.backdrop, directionStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              accessibilityLabel={accessibilityLabel}
              accessibilityViewIsModal
              style={[styles.dialog, { maxWidth }]}
            >
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.settings.modalBackdrop,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(112, 132, 208, 0.28)',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#F5F6FA',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
});
