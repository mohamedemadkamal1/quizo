import { gradients } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { useLeaderboardScreen } from '@/hooks/leaderboard/useLeaderboardScreen';

type LeaderboardContentProps = {
  screen: ReturnType<typeof useLeaderboardScreen>;
};

export function LeaderboardContent({ screen }: LeaderboardContentProps) {

  return (
    <LinearGradient
      colors={gradients.homeBackground.colors}
      locations={gradients.homeBackground.locations}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView
        edges={['top', 'left', 'right']}
        className="flex-1 bg-white"
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ paddingBottom: screen.tabBarHeight }}
        >
          <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
            Leaderboard
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
