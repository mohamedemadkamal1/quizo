import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { CategoryLevelModal } from '@/components/home/CategoryLevelModal';
import { HomeWelcomeSection } from '@/components/home/HomeWelcomeSection';
import { RecentActivitySection } from '@/components/home/RecentActivitySection';
import { colors, gradients } from '@/constants/colors';
import type { useHomeScreen } from '@/hooks/home/useHomeScreen';
import { useTranslation } from '@/hooks/useTranslation';

type HomeContentProps = {
  screen: ReturnType<typeof useHomeScreen>;
};

export function HomeContent({ screen }: HomeContentProps) {
  const { t } = useTranslation();
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
          refreshControl={
            <RefreshControl
              onRefresh={() => void screen.refresh()}
              refreshing={screen.isRefreshing}
              tintColor={colors.home.heading}
            />
          }
          contentContainerStyle={[
            styles.content,
            { paddingBottom: screen.contentBottomPadding },
          ]}
        >
          <HomeWelcomeSection displayName={screen.displayName} />

          {screen.isInitialLoading ? (
            <View
              accessibilityLabel={t('home.loadingLabel')}
              style={styles.statePanel}
            >
              <ActivityIndicator color={colors.home.heading} size="large" />
              <AppText style={styles.stateText}>
                {t('home.loadingMessage')}
              </AppText>
            </View>
          ) : screen.isInitialError ? (
            <View style={styles.statePanel}>
              <AppText style={styles.stateText}>{screen.errorMessage}</AppText>
              <Pressable
                accessibilityRole="button"
                onPress={screen.retry}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.retryButtonPressed,
                ]}
              >
                <AppText style={styles.retryText}>{t('common.retry')}</AppText>
              </Pressable>
            </View>
          ) : screen.isEmpty ? (
            <View style={styles.statePanel}>
              <AppText style={styles.stateText}>{t('home.empty')}</AppText>
            </View>
          ) : (
            <>
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
            </>
          )}
        </Animated.ScrollView>
      </SafeAreaView>

      <CategoryLevelModal
        visible={screen.isCategoryModalVisible}
        category={screen.selectedCategory}
        levels={screen.categoryLevels}
        status={screen.categoryLevelStatus}
        errorMessage={screen.categoryLevelErrorMessage}
        retryDisabled={screen.isRetryingCategoryLevels}
        onDismissed={screen.finishClosingCategoryModal}
        onRetry={screen.retryCategoryLevels}
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
  statePanel: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  stateText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.home.heading,
    includeFontPadding: false,
  },
  retryButton: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.muvBlue300,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryText: {
    fontFamily: 'Fredoka',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
