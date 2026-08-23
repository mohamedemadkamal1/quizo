import { StyleSheet, View } from 'react-native';

import { gameplayColors } from '@/constants/questions';
import { useTranslation } from '@/hooks/useTranslation';

type SegmentedQuestionProgressProps = {
  currentIndex: number;
  totalQuestions: number;
  scale: number;
};

export function SegmentedQuestionProgress({
  currentIndex,
  totalQuestions,
  scale,
}: SegmentedQuestionProgressProps) {
  const { t } = useTranslation();

  return (
    // The segments live in a plain row, so they already fill from the reading
    // side: left to right in English, right to left in Arabic.
    <View
      accessible
      accessibilityLabel={t('questions.progressLabel', {
        current: currentIndex + 1,
        total: totalQuestions,
      })}
      style={[styles.row, { gap: 3 * scale }]}
    >
      {Array.from({ length: totalQuestions }, (_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            {
              height: 6 * scale,
              borderRadius: 3 * scale,
              backgroundColor:
                index < currentIndex
                  ? gameplayColors.orange
                  : index === currentIndex
                    ? gameplayColors.correct
                    : gameplayColors.futureSegment,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
  },
});
