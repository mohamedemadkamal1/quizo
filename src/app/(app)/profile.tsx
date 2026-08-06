import { LinearGradient } from 'expo-linear-gradient';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/atoms/AppButton';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { gradients } from '@/theme/tokens';

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <LinearGradient
      colors={gradients.homeBackground.colors}
      locations={gradients.homeBackground.locations}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <View
          className="flex-1 items-center justify-center gap-6 px-6"
          style={{ paddingBottom: tabBarHeight }}
        >
          <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
            Welcome, {session?.user.displayName}
          </Text>

          <AppButton label="Sign Out" variant="secondary" onPress={signOut} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
