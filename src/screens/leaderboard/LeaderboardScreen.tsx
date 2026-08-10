import { LeaderboardContent } from '@/components/leaderboard/LeaderboardContent';
import { useLeaderboardScreen } from '@/hooks/leaderboard/useLeaderboardScreen';

export function LeaderboardScreen() {
  const screen = useLeaderboardScreen();

  return <LeaderboardContent screen={screen} />;
}
