import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-white">
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ paddingBottom: tabBarHeight }}
      >
        <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
          Leaderboard
        </Text>
      </View>
    </SafeAreaView>
  );
}
