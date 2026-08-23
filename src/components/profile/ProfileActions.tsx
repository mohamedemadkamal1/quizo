import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { getLanguageDescriptor, type TranslationKey } from '@/i18n';

type GuestProfileActionsProps = {
  onCompleteProfile: () => void;
};

type RegisteredProfileActionsProps = {
  onChangePassword: () => void;
  onDeleteProfile: () => void;
  onLogout: () => void;
};

type ProgressActionProps = {
  onPress: () => void;
};

type LanguageActionProps = {
  onPress: () => void;
};

const benefitKeys = [
  ['⭐', 'profile.benefitXp'],
  ['🏆', 'profile.benefitLeaderboard'],
  ['💾', 'profile.benefitProgress'],
  ['🎖️', 'profile.benefitAchievements'],
] as const satisfies readonly (readonly [string, TranslationKey])[];

export function GuestProfileActions({
  onCompleteProfile,
}: GuestProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.guestGroup}>
      <View style={styles.unlockCard}>
        <AppText style={styles.decorativeStar}>☆</AppText>
        <AppText accessibilityRole="header" style={styles.unlockTitle}>
          {t('profile.unlockTitle')}
        </AppText>
        <AppText style={styles.unlockBody}>{t('profile.unlockBody')}</AppText>
        <View style={styles.benefitGrid}>
          {benefitKeys.map(([icon, labelKey]) => (
            <View key={labelKey} style={styles.benefitItem}>
              <AppText style={styles.benefitIcon}>{icon}</AppText>
              <AppText style={styles.benefitText}>{t(labelKey)}</AppText>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(255, 255, 255, 0.14)' }}
        onPress={onCompleteProfile}
        style={styles.completeButton}
      >
        <LinearGradient
          colors={[colors.settings.headerEnd, colors.settings.violet]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.completeGradient}
        >
          <AppText
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.completeText}
          >
            {t('profile.completeProfile')}
          </AppText>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export function ProgressAction({ onPress }: ProgressActionProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={{ color: 'rgba(255, 255, 255, 0.14)' }}
      onPress={onPress}
      style={styles.progressPressable}
    >
      <LinearGradient
        colors={[colors.settings.headerEnd, '#9B79ED']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.progressRow}
      >
        <View style={styles.progressIconTile}>
          <ProfileIcon name="progress" color="#FFFFFF" size={24} />
        </View>
        <View style={styles.progressCopy}>
          <AppText style={styles.progressTitle}>
            {t('profile.progressTitle')}
          </AppText>
          <AppText style={styles.progressSubtitle}>
            {t('profile.progressSubtitle')}
          </AppText>
        </View>
        <ProfileIcon name="chevron" color="#FFFFFF" size={18} />
      </LinearGradient>
    </Pressable>
  );
}

/**
 * Available to guests and registered players alike, and placed between
 * "My Progress" and the registered-only account actions.
 *
 * Pressing it hands off to the platform's own selection UI rather than opening
 * a Quizo-styled dialog.
 */
export function LanguageAction({ onPress }: LanguageActionProps) {
  const { t, language } = useTranslation();
  const descriptor = getLanguageDescriptor(language);
  const currentLanguageLabel = `${descriptor.flag} ${descriptor.endonym}`;

  return (
    <Pressable
      accessibilityHint={t('language.selectorHint')}
      accessibilityLabel={t('language.title')}
      accessibilityRole="button"
      accessibilityValue={{ text: currentLanguageLabel }}
      android_ripple={{ color: 'rgba(124, 58, 237, 0.08)' }}
      onPress={onPress}
      style={styles.passwordRow}
    >
      <View style={styles.passwordIconTile}>
        <ProfileIcon name="globe" color={colors.settings.violet} size={21} />
      </View>
      <View style={styles.passwordCopy}>
        <AppText style={styles.passwordTitle}>{t('language.title')}</AppText>
        <AppText numberOfLines={1} style={styles.passwordSubtitle}>
          {currentLanguageLabel}
        </AppText>
      </View>
      <ProfileIcon name="chevron" color={colors.settings.muted} size={18} />
    </Pressable>
  );
}

export function RegisteredProfileActions({
  onChangePassword,
  onDeleteProfile,
  onLogout,
}: RegisteredProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.registeredGroup}>
      <Pressable
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(124, 58, 237, 0.08)' }}
        onPress={onChangePassword}
        style={styles.passwordRow}
      >
        <View style={styles.passwordIconTile}>
          <ProfileIcon name="lock" color={colors.settings.violet} size={21} />
        </View>
        <View style={styles.passwordCopy}>
          <AppText style={styles.passwordTitle}>
            {t('profile.changePasswordTitle')}
          </AppText>
          <AppText style={styles.passwordSubtitle}>
            {t('profile.changePasswordSubtitle')}
          </AppText>
        </View>
        <ProfileIcon name="chevron" color={colors.settings.muted} size={18} />
      </Pressable>

      <View style={styles.destructiveRow}>
        <Pressable
          accessibilityRole="button"
          android_ripple={{ color: 'rgba(245, 93, 110, 0.08)' }}
          onPress={onLogout}
          style={[styles.actionCard, styles.logoutCard]}
        >
          <View style={[styles.actionIconTile, styles.logoutIconTile]}>
            <ProfileIcon
              name="logout"
              color={colors.settings.coral}
              size={22}
            />
          </View>
          <AppText style={[styles.actionTitle, styles.logoutTitle]}>
            {t('profile.logoutTitle')}
          </AppText>
          <AppText style={styles.actionSubtitle}>
            {t('profile.logoutSubtitle')}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          android_ripple={{ color: 'rgba(255, 255, 255, 0.12)' }}
          onPress={onDeleteProfile}
          style={[styles.actionCard, styles.deleteCard]}
        >
          <View style={[styles.actionIconTile, styles.deleteIconTile]}>
            <ProfileIcon name="trash" color="#FFFFFF" size={23} />
          </View>
          <AppText style={[styles.actionTitle, styles.deleteTitle]}>
            {t('profile.deleteTitle')}
          </AppText>
          <AppText style={[styles.actionSubtitle, styles.deleteSubtitle]}>
            {t('profile.deleteSubtitle')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  guestGroup: {
    gap: 14,
  },
  unlockCard: {
    minHeight: 198,
    overflow: 'hidden',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(180, 188, 255, 0.42)',
  },
  decorativeStar: {
    position: 'absolute',
    top: -12,
    end: 12,
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 96,
    lineHeight: 100,
  },
  unlockTitle: {
    color: '#30335F',
    fontFamily: 'Fredoka',
    fontSize: 19,
    fontWeight: '600',
    lineHeight: 24,
  },
  unlockBody: {
    maxWidth: 300,
    marginTop: 12,
    color: '#616894',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
  },
  benefitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    marginTop: 17,
  },
  benefitItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingEnd: 4,
  },
  benefitIcon: {
    fontSize: 11,
  },
  benefitText: {
    minWidth: 0,
    flex: 1,
    color: '#3E426E',
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
  },
  completeButton: {
    height: 54,
    borderRadius: 28,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 4,
  },
  completeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    paddingHorizontal: 16,
  },
  completeText: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressPressable: {
    borderRadius: 15,
  },
  progressRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#7255AE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  progressIconTile: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  progressCopy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
  },
  progressSubtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 14,
  },
  registeredGroup: {
    gap: 20,
  },
  passwordRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordIconTile: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.settings.violetSoft,
  },
  passwordCopy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  passwordTitle: {
    color: '#111827',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
  },
  passwordSubtitle: {
    color: colors.settings.muted,
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 14,
  },
  destructiveRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    minWidth: 0,
    minHeight: 130,
    flex: 1,
    alignItems: 'center',
    borderRadius: 17,
    paddingHorizontal: 10,
    paddingVertical: 19,
  },
  logoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
  },
  deleteCard: {
    backgroundColor: colors.settings.coral,
  },
  actionIconTile: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  logoutIconTile: {
    backgroundColor: colors.settings.coralSoft,
  },
  deleteIconTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  actionTitle: {
    marginTop: 8,
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
  },
  logoutTitle: {
    color: colors.settings.coral,
  },
  deleteTitle: {
    color: '#FFFFFF',
  },
  actionSubtitle: {
    marginTop: 2,
    color: colors.settings.muted,
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  deleteSubtitle: {
    color: 'rgba(255, 255, 255, 0.68)',
  },
});
