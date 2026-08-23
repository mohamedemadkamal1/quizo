import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/common/AppText";
import { levelFailedColors } from "@/constants/level-failed";
import { useTranslation } from "@/hooks/useTranslation";

type FailureStatCardProps = {
  icon: ReactNode;
  value: number;
  label: string;
  scale: number;
  verticalScale: number;
};

export function FailureStatCard({
  icon,
  value,
  label,
  scale,
  verticalScale,
}: FailureStatCardProps) {
  const { t, formatNumber } = useTranslation();
  const formattedValue = formatNumber(value);

  return (
    <View
      accessibilityLabel={t("levelFailed.statLabel", {
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
      {icon}
      <AppText
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        numberOfLines={1}
        style={[styles.value, { fontSize: 21 * scale, lineHeight: 27 * scale }]}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    backgroundColor: levelFailedColors.surface,
  },
  value: {
    maxWidth: "100%",
    marginTop: 3,
    color: levelFailedColors.heading,
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  label: {
    maxWidth: "100%",
    marginTop: 1,
    color: levelFailedColors.muted,
    fontFamily: "Fredoka",
    fontWeight: "400",
    includeFontPadding: false,
    textAlign: "center",
  },
});
