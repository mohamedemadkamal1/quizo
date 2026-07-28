import { View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <AppButton label="Get started" onPress={() => {}} />

      <AppButton label="Sign in" variant="secondary" onPress={() => {}} />
    </View>
  );
}
