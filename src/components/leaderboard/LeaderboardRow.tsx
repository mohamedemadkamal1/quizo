import { StyleSheet, Text, View } from 'react-native';

import { LeaderboardAvatar } from '@/components/leaderboard/LeaderboardAvatar';
import { colors } from '@/constants/colors';
import {
  LEADERBOARD_RANK_PILL_HEIGHT,
  LEADERBOARD_RANK_PILL_WIDTH,
  LEADERBOARD_ROW_AVATAR_SIZE,
  LEADERBOARD_ROW_HEIGHT,
  LEADERBOARD_ROW_RADIUS,
} from '@/constants/leaderboard';
import type { LeaderboardRankedEntry } from '@/types/leaderboard.types';

type LeaderboardRowProps = {
  entry: LeaderboardRankedEntry;
};

const AVATAR_BOTTOM_OFFSET =
  (LEADERBOARD_ROW_HEIGHT - LEADERBOARD_ROW_AVATAR_SIZE) / 2;

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <View
      accessible
      accessibilityLabel={entry.accessibilityLabel}
      style={styles.row}
    >
      <View style={styles.avatar}>
        <LeaderboardAvatar
          initials={entry.initials}
          size={LEADERBOARD_ROW_AVATAR_SIZE}
          source={entry.avatarSource}
        />
      </View>

      <View style={styles.identity}>
        <Text numberOfLines={1} style={styles.name}>
          {entry.displayName}
        </Text>
        <Text numberOfLines={1} style={styles.score}>
          {`Score ${entry.totalScore}`}
        </Text>
      </View>

      <View style={styles.rankPill}>
        <Text numberOfLines={1} style={styles.rankText}>
          {`#${entry.rank}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: LEADERBOARD_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: LEADERBOARD_ROW_RADIUS,
    borderWidth: 1,
    borderColor: colors.leaderboard.rowBorder,
    backgroundColor: colors.leaderboard.rowBackground,
    paddingLeft: 8,
    paddingRight: 10,
    shadowColor: colors.leaderboard.rowShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },

  // The artwork is taller than its circular backdrop, so the box is pinned to
  // the row's baseline and lifted by half the spare height to optically centre
  // the circle without clipping the character above it.
  avatar: {
    alignSelf: 'flex-end',
    marginBottom: AVATAR_BOTTOM_OFFSET,
  },

  identity: {
    minWidth: 0,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 10,
  },

  name: {
    color: colors.leaderboard.rowName,
    fontFamily: 'Fredoka',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    includeFontPadding: false,
  },

  score: {
    marginTop: 1,
    color: colors.leaderboard.rowScore,
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    includeFontPadding: false,
  },

  rankPill: {
    minWidth: LEADERBOARD_RANK_PILL_WIDTH,
    height: LEADERBOARD_RANK_PILL_HEIGHT,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LEADERBOARD_RANK_PILL_HEIGHT / 2,
    paddingHorizontal: 9,
    backgroundColor: colors.leaderboard.rankPill,
  },

  rankText: {
    color: colors.leaderboard.rankPillText,
    fontFamily: 'Fredoka',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    includeFontPadding: false,
  },
});
