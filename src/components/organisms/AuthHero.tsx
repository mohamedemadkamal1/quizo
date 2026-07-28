import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { gradients } from '@/theme/tokens';

const MAX_HERO_HEIGHT = 440;
const HERO_SCREEN_RATIO = 0.55;

export function AuthHero() {
  const { height: screenHeight } = useWindowDimensions();

  const heroHeight = Math.min(
    MAX_HERO_HEIGHT,
    screenHeight * HERO_SCREEN_RATIO,
  );

  return (
    <View
      className="w-full overflow-hidden rounded-b-[70px]"
      style={{ height: heroHeight }}
    >
      <LinearGradient
        colors={gradients.authHero.colors}
        locations={gradients.authHero.locations}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View className="flex-1 items-center justify-center px-[50px] pb-[55px] pt-[55px]">
        <Image
          source={require('../../../assets/images/logo.png')}
          resizeMode="contain"
          className="h-full w-full"
          accessibilityLabel="Quizo"
        />
      </View>
    </View>
  );
}
