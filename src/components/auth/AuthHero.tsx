import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import { gradients } from '@/constants/colors';

const MAX_HERO_HEIGHT = 355;
const HERO_SCREEN_RATIO = 0.445;

type AuthHeroProps = {
  height: number;
};

export function getAuthHeroHeight(screenHeight: number) {
  return Math.min(MAX_HERO_HEIGHT, screenHeight * HERO_SCREEN_RATIO);
}

export function AuthHero({ height }: AuthHeroProps) {
  return (
    <View
      className="w-full overflow-hidden rounded-b-[70px]"
      style={{ height }}
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
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          className="h-full w-full"
          accessibilityLabel="Quizo"
        />
      </View>
    </View>
  );
}
