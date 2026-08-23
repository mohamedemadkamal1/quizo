import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import {
  levelCompleteColors,
  levelCompleteGradients,
} from '@/constants/level-complete';
import { useTranslation } from '@/hooks/useTranslation';

type CompletionProgressRingProps = {
  correctAnswers: number;
  totalQuestions: number;
  isPerfect: boolean;
  scale: number;
};

export function CompletionProgressRing({
  correctAnswers,
  totalQuestions,
  isPerfect,
  scale,
}: CompletionProgressRingProps) {
  const { t, formatNumber } = useTranslation();
  const size = 136 * scale;
  const strokeWidth = 13 * scale;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(1, Math.max(0, correctAnswers / totalQuestions));

  return (
    <View
      accessibilityLabel={t('common.progressRingLabel', {
        correct: correctAnswers,
        total: totalQuestions,
      })}
      accessibilityRole="progressbar"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient
            id="completionProgressGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <Stop offset="0" stopColor={levelCompleteGradients.progress[0]} />
            <Stop offset="1" stopColor={levelCompleteGradients.progress[1]} />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={levelCompleteColors.track}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          origin={`${size / 2}, ${size / 2}`}
          r={radius}
          rotation={isPerfect ? -90 : 18}
          stroke={
            isPerfect
              ? levelCompleteColors.green
              : 'url(#completionProgressGradient)'
          }
          strokeDasharray={`${circumference * ratio} ${circumference}`}
          strokeLinecap="butt"
          strokeWidth={strokeWidth}
        />
      </Svg>

      <View pointerEvents="none" style={styles.copy}>
        <AppText
          style={[
            styles.score,
            {
              color: isPerfect
                ? levelCompleteColors.green
                : levelCompleteColors.heading,
              fontSize: 36 * scale,
              lineHeight: 43 * scale,
            },
          ]}
        >
          {formatNumber(correctAnswers)}
        </AppText>
        <AppText
          style={[
            styles.total,
            { fontSize: 14 * scale, lineHeight: 18 * scale },
          ]}
        >
          {t('common.progressRingTotal', {
            total: formatNumber(totalQuestions),
          })}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  score: {
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  total: {
    color: levelCompleteColors.muted,
    fontFamily: 'Fredoka',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
