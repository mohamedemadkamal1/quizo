import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

export type ActivityCardProps = {
  icon: ReactNode;
  statusLabel: string;
  activityName: string;
  xp: number;
  day: string;
};

export function ActivityCard({
  icon,
  statusLabel,
  activityName,
  xp,
  day,
}: ActivityCardProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${statusLabel}. ${activityName}. Plus ${xp} XP. ${day}`}
      style={styles.card}
    >
      <View style={styles.iconContainer}>{icon}</View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.status}>
            {statusLabel}
          </Text>

          <Text numberOfLines={1} style={styles.xp}>
            +{xp} XP
          </Text>
        </View>

        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.activityName}>
            {activityName}
          </Text>

          <Text numberOfLines={1} style={styles.day}>
            {day}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 290,
    maxWidth: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.activity.cardBackground,

    boxShadow: [
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 2,
        spreadDistance: -1,
        color: 'rgba(0, 0, 0, 0.10)',
      },
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 3,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.10)',
      },
    ],
  },

  iconContainer: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.activity.iconBackground,
  },

  content: {
    flex: 1,
    height: 40,
    justifyContent: 'space-between',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  status: {
    flex: 1,
    fontFamily: 'Fredoka',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.activity.completed,
    includeFontPadding: false,
  },

  activityName: {
    flex: 1,
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    color: colors.activity.title,
    includeFontPadding: false,
  },

  xp: {
    flexShrink: 0,
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.activity.xp,
    includeFontPadding: false,
  },

  day: {
    flexShrink: 0,
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.activity.day,
    includeFontPadding: false,
  },
});
