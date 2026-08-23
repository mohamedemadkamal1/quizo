import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import { getAvatarBoxHeight } from '@/constants/leaderboard';

type LeaderboardAvatarProps = {
  /** Diameter of the circular part of the avatar. */
  size: number;
  source: ImageSourcePropType | null;
  initials: string;
};

/**
 * Renders profile avatar artwork at its exported aspect ratio so the character
 * detail above the circular backdrop is never stretched or clipped, and falls
 * back to a stable neutral initials circle when no avatar is available.
 *
 * The surrounding entry carries the accessibility label, so the avatar itself
 * is hidden from assistive technology.
 */
export function LeaderboardAvatar({
  size,
  source,
  initials,
}: LeaderboardAvatarProps) {
  if (!source) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.fallback,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <AppText
          style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}
        >
          {initials}
        </AppText>
      </View>
    );
  }

  const boxHeight = getAvatarBoxHeight(size);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: boxHeight }}
    >
      <Image
        resizeMode="contain"
        source={source}
        style={[styles.artwork, { width: size, height: boxHeight }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.leaderboard.avatarFallback,
  },

  initials: {
    color: colors.leaderboard.avatarFallbackText,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },

  artwork: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});
