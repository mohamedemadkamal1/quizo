import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

export function DisabledSocialButtons() {
  const { t } = useTranslation();

  return (
    <View style={styles.socialRow}>
      <Pressable
        accessibilityLabel={t('auth.social.googleUnavailable')}
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.socialButton}
      >
        <AppText style={styles.googleText}>G</AppText>
      </Pressable>
      <Pressable
        accessibilityLabel={t('auth.social.appleUnavailable')}
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.socialButton}
      >
        <Svg
          accessibilityElementsHidden
          height={29}
          viewBox="0 0 24 24"
          width={29}
        >
          <Path
            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.31.03-1.73-.79-3.22-.79-1.5 0-1.96.77-3.2.82-1.29.05-2.27-1.31-3.1-2.54C4.45 17 3.16 12.43 4.9 9.39a4.82 4.82 0 0 1 4.09-2.48c1.28-.03 2.49.86 3.22.86.72 0 2.08-1.07 3.5-.91.6.03 2.29.24 3.37 1.86a4.58 4.58 0 0 0-2.02 3.79 4.45 4.45 0 0 0 2.5 4.07 11.1 11.1 0 0 1-.85 2.92M14.74 3.99a4.32 4.32 0 0 1 2.8-1.52 4.43 4.43 0 0 1-1 3.23 3.69 3.69 0 0 1-2.91 1.37 4.11 4.11 0 0 1 1.11-3.08Z"
            fill="#111111"
          />
        </Svg>
      </Pressable>
    </View>
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
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 20,
    opacity: 0.7,
  },
  socialButton: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    shadowColor: '#111827',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  googleText: {
    color: '#4285F4',
    fontFamily: 'Nunito',
    fontSize: 25,
    fontWeight: '900',
  },
  disabled: {
    opacity: 0.55,
  },
});
