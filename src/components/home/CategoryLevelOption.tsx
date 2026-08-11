import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import type { CategoryLevel } from '@/types/home.types';

type CategoryLevelOptionProps = {
  level: CategoryLevel;
  onPress: (level: CategoryLevel) => void;
};

export function CategoryLevelOption({
  level,
  onPress,
}: CategoryLevelOptionProps) {
  const isDisabled = level.levelCount === 0;
  const levelLabel = level.levelCount === 1 ? 'Level' : 'Levels';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isDisabled
          ? `${level.title}, no levels available`
          : `Choose ${level.title}, ${level.levelCount} ${levelLabel}. ${level.description}`
      }
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => onPress(level)}
      style={({ pressed }) => [
        styles.shadow,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={level.gradient}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.92, y: 1 }}
        style={styles.option}
      >
        <Text style={styles.icon}>{level.icon}</Text>

        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>
            {level.title}
          </Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            numberOfLines={1}
            style={styles.description}
          >
            {level.levelCount} {levelLabel} · {level.description}
          </Text>
        </View>

        <Text accessibilityElementsHidden style={styles.stars}>
          {'⭐'.repeat(level.stars)}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
    height: 78,
    flexShrink: 0,
    borderRadius: 16,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 6,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.15)',
      },
    ],
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  option: {
    width: '100%',
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    borderRadius: 16,
    padding: 16,
  },
  icon: {
    width: 36,
    flexShrink: 0,
    fontSize: 36,
    lineHeight: 40,
    includeFontPadding: false,
  },
  copy: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 27.5,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  description: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: colors.home.levelDescription,
    includeFontPadding: false,
  },
  stars: {
    flexShrink: 0,
    fontSize: 18,
    lineHeight: 28,
    color: colors.home.levelStar,
    includeFontPadding: false,
  },
});
