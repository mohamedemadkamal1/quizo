import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { levelCompleteColors } from '@/constants/level-complete';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t, formatNumber } = useTranslation();
  const formattedValue = formatNumber(value);

  return (
    <View
      accessibilityLabel={t('levelComplete.statLabel', {
        value: formattedValue,
        label,
      })}
      style={[
        styles.card,
        {
          width: 106 * scale,
          height: 112 * verticalScale,
          borderRadius: 17 * scale,
        },
      ]}
    >
      <AppText
        accessible={false}
        style={[styles.icon, { fontSize: 27 * scale, lineHeight: 34 * scale }]}
      >
        {icon}
      </AppText>
      <AppText
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        numberOfLines={1}
        style={[
          styles.value,
          {
            color: valueColor,
            fontSize: 21 * scale,
            lineHeight: 27 * scale,
          },
        ]}
      >
        {formattedValue}
      </AppText>
      <AppText
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        numberOfLines={1}
        style={[styles.label, { fontSize: 12 * scale, lineHeight: 16 * scale }]}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: levelCompleteColors.surface,
  },
  icon: {
    includeFontPadding: false,
    textAlign: 'center',
  },
  value: {
    maxWidth: '100%',
    marginTop: 3,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  label: {
    maxWidth: '100%',
    marginTop: 1,
    color: levelCompleteColors.muted,
    fontFamily: 'Fredoka',
    fontWeight: '400',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
