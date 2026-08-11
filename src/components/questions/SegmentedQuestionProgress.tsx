import { StyleSheet, View } from 'react-native';

import { gameplayColors } from '@/constants/questions';

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
  return (
    <View
      accessible
      accessibilityLabel={`Question progress, ${currentIndex + 1} of ${totalQuestions}`}
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
