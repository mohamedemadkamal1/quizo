import { useBottomTabBarHeight } from 'expo-router/js-tabs';

import { useAuthStore } from '@/store/auth.store';

export function useProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  return {
    displayName: session?.user.displayName,
    tabBarHeight,
    onSignOut: signOut,
  };
}
