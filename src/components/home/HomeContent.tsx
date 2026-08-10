import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoriesSection } from '@/components/home/CategoriesSection';
import { CategoryLevelModal } from '@/components/home/CategoryLevelModal';
import { HomeWelcomeSection } from '@/components/home/HomeWelcomeSection';
import { RecentActivitySection } from '@/components/home/RecentActivitySection';
import { gradients } from '@/constants/colors';
import type { useHomeScreen } from '@/hooks/home/useHomeScreen';

type HomeContentProps = {
  screen: ReturnType<typeof useHomeScreen>;
};

export function HomeContent({ screen }: HomeContentProps) {
  const { width: viewportWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const previousScrollY = useSharedValue(0);
  const scrollDirection = useSharedValue(1);
  const viewportHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const nextScrollY = Math.max(0, event.contentOffset.y);
      const delta = nextScrollY - previousScrollY.value;

      if (Math.abs(delta) > 1) {
        scrollDirection.value = delta > 0 ? 1 : -1;
      }

      previousScrollY.value = nextScrollY;
      scrollY.value = nextScrollY;
    },
  });

  return (
    <LinearGradient
      colors={gradients.homeBackground.colors}
      locations={gradients.homeBackground.locations}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <Animated.ScrollView
          onLayout={(event) => {
            viewportHeight.set(event.nativeEvent.layout.height);
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: screen.contentBottomPadding },
          ]}
        >
          <HomeWelcomeSection displayName={screen.displayName} />

          <RecentActivitySection
            activities={screen.recentActivities}
            illustrationSource={require('../../assets/images/illustrations/home/home-student.png')}
          />

          <CategoriesSection
            categories={screen.categories}
            scrollY={scrollY}
            scrollDirection={scrollDirection}
            viewportHeight={viewportHeight}
            viewportWidth={viewportWidth}
            onPressCategory={screen.openCategoryModal}
          />
        </Animated.ScrollView>
      </SafeAreaView>

      <CategoryLevelModal
        visible={screen.isCategoryModalVisible}
        category={screen.selectedCategory}
        levels={screen.categoryLevels}
        onDismissed={screen.finishClosingCategoryModal}
        onSelectLevel={screen.handleSelectCategoryLevel}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
