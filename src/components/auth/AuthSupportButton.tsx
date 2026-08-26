import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { useSupportModal } from '@/components/support/SupportModalProvider';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

export function AuthSupportButton() {
  const { t } = useTranslation();
  const { openSupportModal } = useSupportModal();

  return (
    <Pressable
      accessibilityHint={t('support.openHint')}
      accessibilityLabel={t('support.label')}
      accessibilityRole="button"
      android_ripple={{ color: 'rgba(72, 91, 221, 0.1)' }}
      onPress={openSupportModal}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <AppText style={styles.label}>{t('support.label')}</AppText>
        <ProfileIcon
          color={colors.settings.violet}
          name="headset"
          size={25}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 110,
    height: 48,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#E5E9FF',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    color: '#3E426E',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
});
