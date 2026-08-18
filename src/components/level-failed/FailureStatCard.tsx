import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { levelFailedColors } from "@/constants/level-failed";

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
      {icon}
      <Text
        style={[styles.value, { fontSize: 21 * scale, lineHeight: 27 * scale }]}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: levelFailedColors.surface,
  },
  value: {
    marginTop: 3,
    color: levelFailedColors.heading,
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  label: {
    marginTop: 1,
    color: levelFailedColors.muted,
    fontFamily: "Fredoka",
    fontWeight: "400",
    includeFontPadding: false,
    textAlign: "center",
  },
});
