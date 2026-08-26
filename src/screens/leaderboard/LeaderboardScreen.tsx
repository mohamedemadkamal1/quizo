import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaderboardContent } from '@/components/leaderboard/LeaderboardContent';
import { useLeaderboardScreen } from '@/hooks/leaderboard/useLeaderboardScreen';

export function LeaderboardScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const screen = useLeaderboardScreen(tabBarHeight + 24);

  return <LeaderboardContent screen={screen} />;
}

export function LevelCompleteLeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screen = useLeaderboardScreen(insets.bottom + 24);

  return (
    <LeaderboardContent
      onBack={() => router.back()}
      screen={screen}
    />
  );
}
