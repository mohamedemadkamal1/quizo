import { useBottomTabBarHeight } from 'expo-router/js-tabs';

export function useSettingsScreen() {
  return { tabBarHeight: useBottomTabBarHeight() };
}
