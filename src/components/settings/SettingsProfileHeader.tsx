import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { SettingsIcon } from '@/components/settings/SettingsIcon';
import { SettingsText as Text } from '@/components/settings/SettingsText';
import { colors } from '@/constants/colors';
import type { SettingsProfileViewModel } from '@/types/settings.types';

type SettingsProfileHeaderProps = {
  profile: SettingsProfileViewModel;
  onEditName: () => void;
};

export function SettingsProfileHeader({
  profile,
  onEditName,
}: SettingsProfileHeaderProps) {
  const isRegistered = profile.mode === 'registered';

  return (
    <LinearGradient
      colors={[colors.settings.headerStart, colors.settings.headerEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View
        style={[
          styles.badge,
          isRegistered ? styles.registeredBadge : undefined,
        ]}
      >
        {isRegistered ? <Text style={styles.badgeStar}>⭐</Text> : null}
        <Text style={styles.badgeText}>
          {isRegistered ? 'REGISTERED' : 'Guest'}
        </Text>
      </View>

      <View style={styles.identityRow}>
        <View
          accessible
          accessibilityLabel={`${profile.displayName} initials`}
          style={styles.avatar}
        >
          <Text style={styles.initials}>{profile.initials}</Text>
        </View>

        <View style={styles.nameColumn}>
          <View style={styles.nameRow}>
            <Text
              accessibilityRole="header"
              numberOfLines={1}
              style={styles.name}
            >
              {profile.displayName}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit display name"
              hitSlop={12}
              onPress={onEditName}
              style={styles.editButton}
            >
              <SettingsIcon name="edit" color="#FFFFFF" size={20} />
            </Pressable>
          </View>

          <View style={styles.nameUnderline} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 144,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 19,
    right: 34,
    minWidth: 64,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  badgeStar: {
    fontSize: 14,
    lineHeight: 17,
  },
  registeredBadge: {
    paddingLeft: 23,
    paddingRight: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    includeFontPadding: false,
  },
  identityRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingTop: 21,
    transform: [{ translateY: -12 }],
  },
  avatar: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#321079',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  initials: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  nameColumn: {
    flex: 1,
    maxWidth: 128,
    paddingTop: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  name: {
    flexShrink: 1,
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 23,
    includeFontPadding: false,
  },
  editButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameUnderline: {
    width: '100%',
    height: 1.5,
    marginTop: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
  },
});
