import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

type ProfileSoundControlProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function ProfileSoundControl({
  enabled,
  onChange,
}: ProfileSoundControlProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconTile}>
        <ProfileIcon
          color={colors.settings.violet}
          name="speaker"
          size={23}
        />
      </View>

      <View style={styles.copy}>
        <AppText alignToLanguage style={styles.title}>
          {t('profile.soundLabel')}
        </AppText>
        <AppText alignToLanguage numberOfLines={2} style={styles.description}>
          {t('profile.soundDescription')}
        </AppText>
      </View>

      <View style={styles.switchGroup}>
        <AppText style={styles.stateLabel}>
          {t(enabled ? 'profile.soundOn' : 'profile.soundOff')}
        </AppText>
        <Switch
          accessibilityHint={t('profile.soundDescription')}
          accessibilityLabel={t('profile.soundLabel')}
          ios_backgroundColor={colors.settings.muted}
          onValueChange={onChange}
          thumbColor="#FFFFFF"
          trackColor={{
            false: colors.settings.muted,
            true: colors.settings.violet,
          }}
          value={enabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.38)',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  iconTile: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.settings.violetSoft,
  },
  copy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  title: {
    color: '#111827',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
  },
  description: {
    color: colors.settings.muted,
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 14,
  },
  switchGroup: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  stateLabel: {
    color: colors.settings.violet,
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
  },
});
