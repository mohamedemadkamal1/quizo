import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { GoldPauseGlyph } from '@/components/questions/QuestionIcons';
import { SegmentedQuestionProgress } from '@/components/questions/SegmentedQuestionProgress';
import { gameplayColors } from '@/constants/questions';
import { useTranslation } from '@/hooks/useTranslation';

type QuestionHeaderProps = {
  currentIndex: number;
  totalQuestions: number;
  scale: number;
  verticalScale: number;
  onPause: () => void;
};

function HeaderDecorations({
  scale,
  verticalScale,
}: {
  scale: number;
  verticalScale: number;
}) {
  return (
    <Svg
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      preserveAspectRatio="none"
      viewBox="0 0 400 110"
      style={[
        styles.decorations,
        { width: 400 * scale, height: 110 * verticalScale },
      ]}
    >
      <Path
        d="m346 20 3.2 7.8 8.4.7-6.4 5.5 2 8.2-7.2-4.3-7.2 4.3 2-8.2-6.4-5.5 8.4-.7Z"
        fill={gameplayColors.gold}
      />
      <Path
        d="m81 76 2.2 5.2 5.6.5-4.3 3.7 1.4 5.5-4.9-2.9-4.8 2.9 1.3-5.5-4.2-3.7 5.5-.5Z"
        fill={gameplayColors.gold}
        opacity="0.72"
      />
      <Path
        d="m369 65 1.3 3.1 3.3.3-2.5 2.2.8 3.3-2.9-1.8-2.9 1.8.8-3.3-2.5-2.2 3.3-.3Z"
        fill={gameplayColors.orange}
        opacity="0.7"
      />
    </Svg>
  );
}

export function QuestionHeader({
  currentIndex,
  totalQuestions,
  scale,
  verticalScale,
  onPause,
}: QuestionHeaderProps) {
  const { t } = useTranslation();
  const pauseVisualSize = 44 * scale;
  const pauseTouchOffset = (44 - pauseVisualSize) / 2;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <HeaderDecorations scale={scale} verticalScale={verticalScale} />

      <View
        style={[
          styles.progress,
          {
            top: 16 * verticalScale,
            start: 89 * scale,
            width: 218 * scale,
          },
        ]}
      >
        <SegmentedQuestionProgress
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          scale={scale}
        />
      </View>

      <Pressable
        accessibilityLabel={t('questions.pauseLabel')}
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(255, 159, 10, 0.12)' }}
        onPress={onPause}
        style={[
          styles.pauseButton,
          {
            top: 40 * verticalScale - pauseTouchOffset,
            start: 20 * scale - pauseTouchOffset,
          },
        ]}
      >
        <View
          style={[
            styles.pauseSurface,
            {
              width: pauseVisualSize,
              height: pauseVisualSize,
              borderRadius: pauseVisualSize / 2,
            },
          ]}
        >
          <GoldPauseGlyph
            gradientId="questionPauseGradient"
            size={pauseVisualSize * 0.72}
          />
        </View>
      </Pressable>

      <AppText
        accessibilityRole="header"
        numberOfLines={1}
        style={[
          styles.heading,
          {
            top: 49 * verticalScale,
            fontSize: 19 * scale,
            lineHeight: 25 * scale,
          },
        ]}
      >
        {t('questions.header', { current: currentIndex + 1 })}
        <AppText style={styles.headingAccent}>
          {t('questions.headerTotal', { total: totalQuestions })}
        </AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progress: {
    position: 'absolute',
    height: 8,
  },
  pauseButton: {
    position: 'absolute',
    zIndex: 3,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseSurface: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  heading: {
    position: 'absolute',
    right: 0,
    left: 0,
    color: gameplayColors.heading,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  headingAccent: {
    color: gameplayColors.orange,
  },
});
