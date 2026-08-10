import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { SettingsIcon } from '@/components/settings/SettingsIcon';
import { SettingsText as Text } from '@/components/settings/SettingsText';
import { colors } from '@/constants/colors';

type GuestSettingsActionsProps = {
  onCompleteProfile: () => void;
};

type RegisteredSettingsActionsProps = {
  onChangePassword: () => void;
  onDeleteAccount: () => void;
  onLogOut: () => void;
  isLoggingOut: boolean;
};

const guestBenefits = [
  'Save your game progress',
  'Earn XP and badges',
  'Access all categories',
] as const;

export function GuestSettingsActions({
  onCompleteProfile,
}: GuestSettingsActionsProps) {
  return (
    <View style={styles.guestGroup}>
      <View style={styles.unlockCard}>
        <View style={styles.unlockHeadingRow}>
          <Text style={styles.unlockTitle}>★</Text>
          <Text accessibilityRole="header" style={styles.cardHeading}>
            Unlock Full Access
          </Text>
        </View>

        <Text style={styles.cardBody}>
          Create a free account to save your progress, earn badges, and compete
          on the leaderboard.
        </Text>

        <View style={styles.benefitList}>
          {guestBenefits.map((benefit) => (
            <View key={benefit} style={styles.benefitRow}>
              <Text style={styles.benefitCheck}>✓</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onCompleteProfile}
        style={styles.completeButton}
      >
        <LinearGradient
          colors={[colors.settings.headerEnd, colors.settings.violet]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.completeGradient}
        >
          <Text style={styles.completeButtonText}>Complete Profile →</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export function RegisteredSettingsActions({
  onChangePassword,
  onDeleteAccount,
  onLogOut,
  isLoggingOut,
}: RegisteredSettingsActionsProps) {
  return (
    <View style={styles.registeredGroup}>
      <Pressable
        accessibilityRole="button"
        onPress={onChangePassword}
        style={styles.passwordRow}
      >
        <View style={[styles.iconTile, styles.violetIconTile]}>
          <SettingsIcon name="lock" color={colors.settings.violet} size={21} />
        </View>
        <View style={styles.passwordCopy}>
          <Text style={styles.passwordTitle}>Change Password</Text>
          <Text style={styles.passwordSubtitle}>
            Change your account password
          </Text>
        </View>
        <SettingsIcon name="chevron" color={colors.settings.muted} size={18} />
      </Pressable>

      <View style={styles.destructiveRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: isLoggingOut, disabled: isLoggingOut }}
          disabled={isLoggingOut}
          onPress={onLogOut}
          style={[styles.actionCard, styles.logoutCard]}
        >
          <View style={[styles.iconTile, styles.coralIconTile]}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={colors.settings.coral} />
            ) : (
              <SettingsIcon
                name="logout"
                color={colors.settings.coral}
                size={22}
              />
            )}
          </View>
          <Text style={[styles.actionTitle, styles.logoutTitle]}>Log Out</Text>
          <Text style={styles.actionSubtitle}>Sign out of your account</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onDeleteAccount}
          style={[styles.actionCard, styles.deleteCard]}
        >
          <View style={[styles.iconTile, styles.deleteIconTile]}>
            <SettingsIcon name="trash" color="#FFFFFF" size={23} />
          </View>
          <Text style={[styles.actionTitle, styles.deleteTitle]}>Delete</Text>
          <Text style={[styles.actionSubtitle, styles.deleteSubtitle]}>
            Delete your account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  guestGroup: {
    gap: 14,
    marginHorizontal: 4,
  },
  unlockCard: {
    minHeight: 208,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.settings.surfaceSoft,
  },
  unlockHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unlockTitle: {
    color: colors.settings.violet,
    fontSize: 21,
    lineHeight: 25,
  },
  cardHeading: {
    color: colors.settings.heading,
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    includeFontPadding: false,
  },
  cardBody: {
    marginTop: 14,
    color: colors.settings.body,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 22,
    includeFontPadding: false,
  },
  benefitList: {
    marginTop: 10,
    gap: 5,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitCheck: {
    color: colors.settings.green,
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
  benefitText: {
    flex: 1,
    color: colors.settings.heading,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    includeFontPadding: false,
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
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    includeFontPadding: false,
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
  iconTile: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  violetIconTile: {
    backgroundColor: colors.settings.violetSoft,
  },
  coralIconTile: {
    backgroundColor: colors.settings.coralSoft,
  },
  deleteIconTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  passwordCopy: {
    flex: 1,
    gap: 3,
  },
  passwordTitle: {
    color: '#111827',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    includeFontPadding: false,
  },
  passwordSubtitle: {
    color: colors.settings.muted,
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
    includeFontPadding: false,
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
  actionTitle: {
    marginTop: 8,
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    includeFontPadding: false,
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
    fontWeight: '400',
    lineHeight: 14,
    textAlign: 'center',
    includeFontPadding: false,
  },
  deleteSubtitle: {
    color: 'rgba(255, 255, 255, 0.68)',
  },
});
