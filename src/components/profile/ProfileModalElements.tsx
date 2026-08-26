import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

type ModalHeaderProps = {
  title: string;
  isBusy: boolean;
  onClose: () => void;
};

type ModalSubmitButtonProps = PropsWithChildren<{
  isBusy: boolean;
  isDisabled?: boolean;
  onPress: () => void;
}>;

export function ProfileModalHeader({
  title,
  isBusy,
  onClose,
}: ModalHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <AppText accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      <Pressable
        accessibilityLabel={t('common.close')}
        accessibilityRole="button"
        disabled={isBusy}
        hitSlop={10}
        onPress={onClose}
        style={[styles.closeButton, isBusy && styles.disabled]}
      >
        <ProfileIcon name="close" color="#4B63D7" size={28} />
      </Pressable>
    </View>
  );
}

export function ProfileModalSubmitButton({
  isBusy,
  isDisabled = false,
  onPress,
  children,
}: ModalSubmitButtonProps) {
  const disabled = isBusy || isDisabled;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: isBusy, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.submitButton, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={[colors.muvBlue300, colors.settings.violet]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.submitGradient}
      >
        {isBusy ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <AppText
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.submitText}
          >
            {children}
          </AppText>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function ProfileModalError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <AppText
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={styles.error}
    >
      {message}
    </AppText>
  );
}

export const profileModalStyles = StyleSheet.create({
  fields: {
    gap: 14,
    marginTop: 24,
  },
});

const styles = StyleSheet.create({
  header: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 38,
  },
  title: {
    color: '#4B63D7',
    fontFamily: 'Fredoka',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 32,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    end: 0,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    height: 58,
    marginTop: 28,
    borderRadius: 30,
    shadowColor: '#172554',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 5,
  },
  submitGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  submitText: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '600',
  },
  error: {
    marginTop: 16,
    color: '#BE123C',
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
});
