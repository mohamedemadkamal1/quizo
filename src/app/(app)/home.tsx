import { Text, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export default function HomeScreen() {
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-white px-6">
      <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
        Welcome, {session?.user.displayName}
      </Text>

      <AppButton label="Sign Out" variant="secondary" onPress={signOut} />
    </View>
  );
}
