import { useBottomTabBarHeight } from 'expo-router/js-tabs';

export function useLeaderboardScreen() {
  return { tabBarHeight: useBottomTabBarHeight() };
}
