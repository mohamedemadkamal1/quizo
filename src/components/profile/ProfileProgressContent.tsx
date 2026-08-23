import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import type { useProfileProgressScreen } from '@/hooks/profile/useProfileProgressScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { getSafeNonNegativeValue } from '@/utils/profile';

const trophySource = require('../../assets/images/illustrations/profile/progress-trophy.png');

type ProfileProgressContentProps = {
  screen: ReturnType<typeof useProfileProgressScreen>;
};

export function ProfileProgressContent({
  screen,
}: ProfileProgressContentProps) {
  const { t, formatNumber } = useTranslation();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.topShape} />
      <View pointerEvents="none" style={styles.leftShape} />
      <View pointerEvents="none" style={styles.bottomShape} />
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: screen.contentBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppText accessibilityRole="header" style={styles.heading}>
          {t('profile.progressScreen.heading')}
        </AppText>
        <AppText style={styles.subtitle}>
          {t('profile.progressScreen.subtitle')}
        </AppText>

        {screen.isInitialLoading ? (
          <View
            accessibilityLabel={t('profile.progressScreen.loadingLabel')}
            style={styles.stateCard}
          >
            <ActivityIndicator color={colors.settings.violet} size="large" />
            <AppText style={styles.stateText}>
              {t('profile.progressScreen.loadingMessage')}
            </AppText>
          </View>
        ) : screen.isInitialError ? (
          <View style={styles.stateCard}>
            <AppText accessibilityRole="alert" style={styles.stateTitle}>
              {t('profile.progressScreen.errorTitle')}
            </AppText>
            <AppText style={styles.stateText}>{screen.errorMessage}</AppText>
            <Pressable
              accessibilityRole="button"
              disabled={screen.isRetrying}
              onPress={screen.retry}
              style={styles.retryButton}
            >
              {screen.isRetrying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <AppText numberOfLines={1} style={styles.retryText}>
                  {t('common.tryAgain')}
                </AppText>
              )}
            </Pressable>
          </View>
        ) : screen.isEmpty ? (
          <View style={styles.stateCard}>
            <AppText style={styles.emptyIcon}>{'\u{1F331}'}</AppText>
            <AppText style={styles.emptyTotals}>
              {t('profile.progressScreen.emptyTotals')}
            </AppText>
            <AppText accessibilityRole="header" style={styles.stateTitle}>
              {t('profile.progressScreen.emptyTitle')}
            </AppText>
            <AppText style={styles.stateText}>
              {t('profile.progressScreen.emptyBody')}
            </AppText>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={['#8B5CF6', '#A36EF2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <Image
                accessibilityLabel={t('profile.progressScreen.trophyLabel')}
                contentFit="contain"
                source={trophySource}
                style={styles.trophy}
              />
              <View style={styles.metric}>
                <View style={styles.metricIcon}>
                  <AppText style={styles.metricGlyph}>{'\u2B50'}</AppText>
                </View>
                <View style={styles.metricCopy}>
                  <AppText numberOfLines={1} style={styles.metricValue}>
                    {formatNumber(screen.xpEarned)}
                  </AppText>
                  <AppText numberOfLines={2} style={styles.metricLabel}>
                    {t('profile.progressScreen.xpEarned')}
                  </AppText>
                </View>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <View style={styles.metricIcon}>
                  <AppText style={styles.metricGlyph}>{'\u{1F3C5}'}</AppText>
                </View>
                <View style={styles.metricCopy}>
                  <AppText numberOfLines={1} style={styles.metricValue}>
                    {formatNumber(screen.completedLevels)}
                  </AppText>
                  <AppText numberOfLines={2} style={styles.metricLabel}>
                    {t('profile.progressScreen.completedLevels')}
                  </AppText>
                </View>
              </View>
              <View style={styles.summaryRule} />
              <AppText numberOfLines={1} style={styles.summaryNote}>
                {t('profile.progressScreen.summaryNote')}
              </AppText>
            </LinearGradient>

            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>
                {t('profile.progressScreen.topAchievements')}
              </AppText>
            </View>
            <View style={styles.achievementRow}>
              {screen.topAchievements.map(({ item, icon, gradient }) => (
                <LinearGradient
                  colors={gradient}
                  key={item.id}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.achievementCard}
                >
                  <View style={styles.achievementIconCircle}>
                    <AppText style={styles.achievementIcon}>{icon}</AppText>
                  </View>
                  <AppText numberOfLines={1} style={styles.achievementName}>
                    {item.name}
                  </AppText>
                  <AppText numberOfLines={1} style={styles.achievementXp}>
                    {formatNumber(getSafeNonNegativeValue(item.totalXp))}
                  </AppText>
                </LinearGradient>
              ))}
            </View>

            <AppText style={[styles.sectionTitle, styles.categoryHeading]}>
              {t('profile.progressScreen.progressByCategory')}
            </AppText>
            <View style={styles.categoryList}>
              {screen.categories.map(({ item, icon, gradient }) => (
                <View key={item.id} style={styles.categoryRow}>
                  <LinearGradient colors={gradient} style={styles.categoryIcon}>
                    <AppText style={styles.categoryGlyph}>{icon}</AppText>
                  </LinearGradient>
                  <View style={styles.categoryCopy}>
                    <AppText numberOfLines={1} style={styles.categoryName}>
                      {item.name}
                    </AppText>
                    <AppText numberOfLines={1} style={styles.categoryScore}>
                      {t('profile.progressScreen.categoryScore', {
                        score: formatNumber(
                          getSafeNonNegativeValue(item.totalXp),
                        ),
                      })}
                    </AppText>
                  </View>
                  <View style={styles.categoryCount}>
                    <AppText
                      numberOfLines={1}
                      style={styles.categoryCountValue}
                    >
                      {t('profile.progressScreen.categoryCount', {
                        completed: formatNumber(
                          getSafeNonNegativeValue(item.completedLevels),
                        ),
                        total: formatNumber(
                          getSafeNonNegativeValue(item.totalLevels),
                        ),
                      })}
                    </AppText>
                    <AppText numberOfLines={2} style={styles.categoryCountLabel}>
                      {t('profile.progressScreen.completedLevels')}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#C7D2FE',
  },
  topShape: {
    position: 'absolute',
    top: -30,
    right: -65,
    width: 220,
    height: 230,
    borderRadius: 100,
    backgroundColor: 'rgba(167, 139, 250, 0.09)',
    transform: [{ rotate: '-15deg' }],
  },
  leftShape: {
    position: 'absolute',
    top: 400,
    left: -120,
    width: 240,
    height: 250,
    borderRadius: 110,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    transform: [{ rotate: '22deg' }],
  },
  bottomShape: {
    position: 'absolute',
    right: -86,
    bottom: -30,
    width: 230,
    height: 260,
    borderRadius: 110,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    transform: [{ rotate: '-22deg' }],
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 25,
  },
  heading: {
    color: '#8654E8',
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 3,
    color: '#8290BD',
    fontFamily: 'Nunito',
    fontSize: 12,
    lineHeight: 16,
  },
  summaryCard: {
    minHeight: 132,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    marginTop: 38,
    paddingHorizontal: 16,
    paddingBottom: 28,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  trophy: {
    width: 75,
    height: 77,
    marginEnd: 3,
  },
  metric: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metricCopy: {
    minWidth: 0,
    flex: 1,
  },
  metricIcon: {
    width: 27,
    height: 27,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  metricGlyph: {
    fontSize: 14,
  },
  metricValue: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontFamily: 'Nunito',
    fontSize: 9,
    lineHeight: 12,
  },
  metricDivider: {
    width: 1,
    height: 45,
    marginHorizontal: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryRule: {
    position: 'absolute',
    end: 16,
    bottom: 25,
    start: 16,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryNote: {
    position: 'absolute',
    end: 12,
    bottom: 9,
    start: 12,
    color: 'rgba(255, 255, 255, 0.78)',
    fontFamily: 'Nunito',
    fontSize: 8,
    lineHeight: 11,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#111827',
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  achievementRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  achievementCard: {
    minWidth: 0,
    minHeight: 112,
    flex: 1,
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
  },
  achievementIconCircle: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementName: {
    width: '100%',
    marginTop: 6,
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  achievementXp: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Nunito',
    fontSize: 12,
    lineHeight: 15,
  },
  categoryHeading: {
    marginTop: 33,
  },
  categoryList: {
    gap: 10,
    marginTop: 14,
  },
  categoryRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.69)',
  },
  categoryIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  categoryGlyph: {
    fontSize: 23,
  },
  categoryCopy: {
    minWidth: 0,
    flex: 1,
  },
  categoryName: {
    color: '#111827',
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  categoryScore: {
    color: '#9CA3AF',
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 14,
  },
  categoryCount: {
    maxWidth: 96,
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  categoryCountValue: {
    color: '#111827',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  categoryCountLabel: {
    color: '#9CA3AF',
    fontFamily: 'Nunito',
    fontSize: 9,
    lineHeight: 12,
  },
  stateCard: {
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    marginTop: 38,
    padding: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  emptyIcon: {
    fontSize: 44,
  },
  emptyTotals: {
    marginTop: 10,
    color: colors.settings.violet,
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'center',
  },
  stateTitle: {
    marginTop: 12,
    color: colors.settings.heading,
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  stateText: {
    marginTop: 10,
    color: colors.settings.body,
    fontFamily: 'Nunito',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 124,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    marginTop: 18,
    backgroundColor: colors.settings.violet,
  },
  retryText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
  },
});
