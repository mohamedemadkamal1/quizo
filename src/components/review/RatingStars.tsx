import { Pressable, StyleSheet, View } from 'react-native';

import { CompletionStar } from '@/components/level-complete/CompletionIcons';
import { useTranslation } from '@/hooks/useTranslation';

const STARS = [1, 2, 3, 4, 5];
const ACTIVE_COLOR = '#FFC300';
const INACTIVE_COLOR = '#BFC9FA';

type RatingStarsProps = {
  value: number;
  onChange: (stars: number) => void;
};

/**
 * The stars are an invitation, not a filter: whichever count the player taps,
 * the card keeps offering the same store flow. Both stores forbid deciding who
 * gets asked based on an in-app opinion, so nothing downstream reads this value.
 */
export function RatingStars({ value, onChange }: RatingStarsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {STARS.map((star) => (
        <Pressable
          key={star}
          accessibilityLabel={t('review.starLabel', { stars: star })}
          accessibilityRole="radio"
          accessibilityState={{ checked: value === star }}
          hitSlop={6}
          onPress={() => onChange(star)}
          style={({ pressed }) => [styles.star, pressed && styles.pressed]}
        >
          <CompletionStar
            color={star <= value ? ACTIVE_COLOR : INACTIVE_COLOR}
            size={44}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 26,
  },
  star: {
    padding: 2,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
});
