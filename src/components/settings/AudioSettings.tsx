import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AudioSlider } from '@/components/settings/AudioSlider';
import { colors } from '@/constants/colors';
import type {
  AudioPreferenceKey,
  AudioPreferences,
} from '@/types/settings.types';

type AudioSettingsProps = {
  preferences: AudioPreferences;
  onChangeEnd: (key: AudioPreferenceKey, value: number) => void;
};

const sliderDefinitions = [
  {
    key: 'musicVolume',
    label: 'Music',
    background: [colors.settings.headerEnd, '#9B79ED'] as const,
    fill: [colors.settings.sliderYellow, colors.settings.sliderOrange] as const,
    thumb: [colors.settings.headerEnd, colors.settings.violet] as const,
  },
  {
    key: 'soundVolume',
    label: 'Sound',
    background: [colors.settings.cyan, colors.settings.cyanEnd] as const,
    fill: [colors.settings.sliderYellow, '#08A9B9'] as const,
    thumb: ['#22C7C5', '#089EB5'] as const,
  },
] as const;

export function AudioSettings({
  preferences,
  onChangeEnd,
}: AudioSettingsProps) {
  return (
    <View accessibilityLabel="Audio settings" style={styles.group}>
      {sliderDefinitions.map((slider) => (
        <LinearGradient
          key={slider.key}
          colors={slider.background}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.sliderBackground}
        >
          <AudioSlider
            label={slider.label}
            preferenceKey={slider.key}
            value={preferences[slider.key]}
            colors={slider.fill}
            thumbColors={slider.thumb}
            onChangeEnd={onChangeEnd}
          />
        </LinearGradient>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 16,
  },
  sliderBackground: {
    borderRadius: 15,
    shadowColor: '#7255AE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
