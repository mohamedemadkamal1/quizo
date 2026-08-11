import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  LevelMapCategory,
  LevelMapTheme,
} from '@/types/level-map.types';

type LevelMapHeaderProps = {
  category: LevelMapCategory;
  totalLevels: number;
  theme: LevelMapTheme;
  onClose: () => void;
};

export function LevelMapHeader({
  category,
  totalLevels,
  theme,
  onClose,
}: LevelMapHeaderProps) {
  const stars = '\u2605 '.repeat(theme.stars).trim();

  return (
    <View>
      <View style={[styles.topBar, { backgroundColor: theme.headerColor }]}>
        <View style={styles.categoryIconSlot}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
        </View>

        <View style={styles.categoryCopy}>
          <Text numberOfLines={1} style={styles.categoryName}>
            {category.name}
          </Text>
          <Text style={styles.subtitle}>Level Map · {totalLevels} levels</Text>
        </View>

        <Pressable
          accessibilityLabel="Close level map"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text style={styles.closeIcon}>{'\u00D7'}</Text>
        </Pressable>
      </View>

      <View style={styles.chipRow}>
        <View style={[styles.chip, { backgroundColor: theme.chipColor }]}>
          <Text style={styles.difficultyIcon}>{theme.icon}</Text>
          <Text style={styles.difficultyLabel}>{theme.label}</Text>
          <Text style={styles.stars}>{stars}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryIconSlot: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 31,
    lineHeight: 38,
    includeFontPadding: false,
  },
  categoryCopy: {
    flex: 1,
    marginLeft: 8,
  },
  categoryName: {
    fontFamily: 'Fredoka',
    fontSize: 21,
    fontWeight: '500',
    lineHeight: 26,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  subtitle: {
    marginTop: 1,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
    color: 'rgba(255, 255, 255, 0.76)',
    includeFontPadding: false,
  },
  closeButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeIcon: {
    marginTop: -2,
    fontFamily: 'Nunito',
    fontSize: 29,
    fontWeight: '400',
    lineHeight: 34,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  chipRow: {
    height: 66,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  chip: {
    alignSelf: 'flex-start',
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 22,
    paddingHorizontal: 17,
  },
  difficultyIcon: {
    fontSize: 19,
  },
  difficultyLabel: {
    fontFamily: 'Fredoka',
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  stars: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFE56B',
    includeFontPadding: false,
  },
});
