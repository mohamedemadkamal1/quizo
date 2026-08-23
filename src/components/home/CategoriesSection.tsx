import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

import { AppText } from '@/components/common/AppText';
import { AnimatedCategoryCard } from '@/components/home/AnimatedCategoryCard';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import type { HomeCategory } from '@/types/home.types';

type CategoriesSectionProps = {
  categories: HomeCategory[];
  scrollY: SharedValue<number>;
  scrollDirection: SharedValue<number>;
  viewportHeight: SharedValue<number>;
  viewportWidth: number;
  onPressCategory: (category: HomeCategory) => void;
};

export function CategoriesSection({
  categories,
  scrollY,
  scrollDirection,
  viewportHeight,
  viewportWidth,
  onPressCategory,
}: CategoriesSectionProps) {
  const { t } = useTranslation();
  const sectionY = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    sectionY.set(event.nativeEvent.layout.y);
  };

  return (
    <View onLayout={handleLayout} style={styles.section}>
      <AppText style={styles.heading}>{t('home.categoriesHeading')}</AppText>

      <View style={styles.cards}>
        {categories.map((category, index) => (
          <AnimatedCategoryCard
            key={category.id}
            category={category}
            index={index}
            sectionY={sectionY}
            scrollY={scrollY}
            scrollDirection={scrollDirection}
            viewportHeight={viewportHeight}
            viewportWidth={viewportWidth}
            onPress={onPressCategory}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
    marginHorizontal: 4,
  },
  heading: {
    marginStart: 4,
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 27,
    color: colors.home.heading,
    includeFontPadding: false,
  },
  cards: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  viewAll: {
    height: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  viewAllText: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19.5,
    color: colors.home.viewAll,
    includeFontPadding: false,
  },
  chevron: {
    marginTop: -3,
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 18,
    color: colors.home.viewAll,
    includeFontPadding: false,
  },
});
