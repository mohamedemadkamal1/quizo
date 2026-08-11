import { StyleSheet, Text, View } from 'react-native';

import { levelCompleteColors } from '@/constants/level-complete';

type CompletionStatCardProps = {
  icon: string;
  value: number;
  label: string;
  valueColor?: string;
  scale: number;
  verticalScale: number;
};

export function CompletionStatCard({
  icon,
  value,
  label,
  valueColor = levelCompleteColors.heading,
  scale,
  verticalScale,
}: CompletionStatCardProps) {
  return (
    <View
      accessibilityLabel={`${value} ${label}`}
      style={[
        styles.card,
        {
          width: 106 * scale,
          height: 112 * verticalScale,
          borderRadius: 17 * scale,
        },
      ]}
    >
      <Text
        accessible={false}
        style={[styles.icon, { fontSize: 27 * scale, lineHeight: 34 * scale }]}
      >
        {icon}
      </Text>
      <Text
        style={[
          styles.value,
          {
            color: valueColor,
            fontSize: 21 * scale,
            lineHeight: 27 * scale,
          },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[styles.label, { fontSize: 12 * scale, lineHeight: 16 * scale }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: levelCompleteColors.surface,
  },
  icon: {
    includeFontPadding: false,
    textAlign: 'center',
  },
  value: {
    marginTop: 3,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  label: {
    marginTop: 1,
    color: levelCompleteColors.muted,
    fontFamily: 'Fredoka',
    fontWeight: '400',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
