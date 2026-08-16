import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { colors } from '@/constants/colors';

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

const benefits = [
  ['⭐', 'Earn XP & level up'],
  ['🏆', 'Compete on leaderboard'],
  ['💾', 'Save your progress'],
  ['🎖️', 'Unlock achievements'],
] as const;

export function GuestProfileActions({
  onCompleteProfile,
}: GuestProfileActionsProps) {
  return (
    <View style={styles.guestGroup}>
      <View style={styles.unlockCard}>
        <Text style={styles.decorativeStar}>☆</Text>
        <Text accessibilityRole="header" style={styles.unlockTitle}>
          🚀 Unlock Full Access!
        </Text>
        <Text style={styles.unlockBody}>
          Create a free account and join thousands of kids learning Islam
          through fun games and challenges!
        </Text>
        <View style={styles.benefitGrid}>
          {benefits.map(([icon, label]) => (
            <View key={label} style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>{icon}</Text>
              <Text style={styles.benefitText}>{label}</Text>
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
          <Text style={styles.completeText}>Complete Profile →</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export function ProgressAction({ onPress }: ProgressActionProps) {
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
          <Text style={styles.progressTitle}>My Progress</Text>
          <Text style={styles.progressSubtitle}>
            View your progress in all categories
          </Text>
        </View>
        <ProfileIcon name="chevron" color="#FFFFFF" size={18} />
      </LinearGradient>
    </Pressable>
  );
}

export function RegisteredProfileActions({
  onChangePassword,
  onDeleteProfile,
  onLogout,
}: RegisteredProfileActionsProps) {
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
          <Text style={styles.passwordTitle}>Change Password</Text>
          <Text style={styles.passwordSubtitle}>
            Change your account password
          </Text>
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
          <Text style={[styles.actionTitle, styles.logoutTitle]}>Log Out</Text>
          <Text style={styles.actionSubtitle}>Sign out of your account</Text>
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
    right: 12,
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
    paddingRight: 4,
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
  },
  completeText: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
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
