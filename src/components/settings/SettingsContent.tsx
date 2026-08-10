import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { useSettingsScreen } from '@/hooks/settings/useSettingsScreen';

type SettingsContentProps = {
  screen: ReturnType<typeof useSettingsScreen>;
};

export function SettingsContent({ screen }: SettingsContentProps) {

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-white">
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ paddingBottom: screen.tabBarHeight }}
      >
        <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
          Settings
        </Text>
      </View>
    </SafeAreaView>
  );
}
