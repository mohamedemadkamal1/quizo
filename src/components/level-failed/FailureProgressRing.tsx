import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { levelFailedColors } from "@/constants/level-failed";

type FailureProgressRingProps = {
  correctAnswers: number;
  totalQuestions: number;
  scale: number;
};

export function FailureProgressRing({
  correctAnswers,
  totalQuestions,
  scale,
}: FailureProgressRingProps) {
  const size = 136 * scale;
  const strokeWidth = 13 * scale;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio =
    totalQuestions === 0
      ? 0
      : Math.min(1, Math.max(0, correctAnswers / totalQuestions));

  return (
    <View
      accessibilityLabel={`${correctAnswers} out of ${totalQuestions} correct`}
      accessibilityRole="progressbar"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={levelFailedColors.track}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          origin={`${size / 2}, ${size / 2}`}
          r={radius}
          rotation={-90}
          stroke={levelFailedColors.red}
          strokeDasharray={`${circumference * ratio} ${circumference}`}
          strokeLinecap="butt"
          strokeWidth={strokeWidth}
        />
      </Svg>

      <View pointerEvents="none" style={styles.copy}>
        <Text
          style={[
            styles.score,
            { fontSize: 36 * scale, lineHeight: 43 * scale },
          ]}
        >
          {correctAnswers}
        </Text>
        <Text
          style={[
            styles.total,
            { fontSize: 14 * scale, lineHeight: 18 * scale },
          ]}
        >
          / {totalQuestions}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  score: {
    color: levelFailedColors.heading,
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  total: {
    color: levelFailedColors.muted,
    fontFamily: "Fredoka",
    fontWeight: "500",
    includeFontPadding: false,
    textAlign: "center",
  },
});
