import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

type ProfileNarrationControlProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function ProfileNarrationControl({
  enabled,
  onChange,
}: ProfileNarrationControlProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <AppText alignToLanguage style={styles.title}>
          {t('profile.readQuestionsAloudTitle')}
        </AppText>
        <AppText alignToLanguage style={styles.description}>
          {t('profile.readQuestionsAloudDescription')}
        </AppText>
      </View>

      <Switch
        accessibilityLabel={t('profile.readQuestionsAloudTitle')}
        accessibilityHint={t('profile.readQuestionsAloudDescription')}
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
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: colors.settings.surfaceSoft,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: colors.settings.heading,
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
    color: colors.settings.body,
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
});
