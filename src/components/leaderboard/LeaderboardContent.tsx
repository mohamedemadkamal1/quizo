import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { LeaderboardPodium } from '@/components/leaderboard/LeaderboardPodium';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { colors } from '@/constants/colors';
import {
  LEADERBOARD_LIST_RADIUS,
  LEADERBOARD_LIST_TOP_PADDING,
  LEADERBOARD_PODIUM_GAP,
  LEADERBOARD_ROW_GAP,
  LEADERBOARD_SUBTITLE_GAP,
  LEADERBOARD_SUBTITLE_LINE_HEIGHT,
  LEADERBOARD_TITLE_LINE_HEIGHT,
  LEADERBOARD_TITLE_TOP,
} from '@/constants/leaderboard';
import type { useLeaderboardScreen } from '@/hooks/leaderboard/useLeaderboardScreen';
import { useTranslation } from '@/hooks/useTranslation';
import type { LeaderboardRankedEntry } from '@/types/leaderboard.types';

type LeaderboardContentProps = {
  screen: ReturnType<typeof useLeaderboardScreen>;
  onBack?: () => void;
};

const TROPHY = '\u{1F3C6}';

function keyExtractor(entry: LeaderboardRankedEntry) {
  return String(entry.id);
}

export function LeaderboardContent({
  onBack,
  screen,
}: LeaderboardContentProps) {
  const { t } = useTranslation();
  const { metrics } = screen;
  const hasEntries = screen.entries.length > 0;

  return (
    <View style={styles.background}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        {hasEntries ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={[
              styles.listSurfaceLayer,
              { top: metrics.listSurfaceTop + LEADERBOARD_LIST_RADIUS },
            ]}
          />
        ) : null}

        <FlatList
          data={screen.entries}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          onEndReached={screen.loadMore}
          onEndReachedThreshold={0.4}
          onScrollBeginDrag={screen.markListScrolled}
          onMomentumScrollBegin={screen.markListScrolled}
          refreshControl={
            <RefreshControl
              onRefresh={() => void screen.refresh()}
              refreshing={screen.isRefreshing}
              tintColor={colors.leaderboard.title}
            />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.titleBar}>
                {onBack ? (
                  <Pressable
                    accessibilityLabel={t('common.back')}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={onBack}
                    style={({ pressed }) => [
                      styles.backButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <ProfileIcon
                      color={colors.leaderboard.title}
                      name="back"
                      size={23}
                    />
                  </Pressable>
                ) : null}

                <View
                  accessible
                  accessibilityRole="header"
                  accessibilityLabel={t('leaderboard.title')}
                  style={styles.titleRow}
                >
                  <AppText style={styles.title}>
                    {t('leaderboard.title')}
                  </AppText>
                  <AppText style={styles.trophy}>{TROPHY}</AppText>
                </View>
              </View>

              <AppText style={styles.subtitle}>
                {t('leaderboard.subtitle')}
              </AppText>

              {screen.podiumEntries.length > 0 ? (
                <View style={styles.podium}>
                  <LeaderboardPodium
                    entries={screen.podiumEntries}
                    metrics={metrics}
                  />
                </View>
              ) : null}

              {hasEntries ? (
                <View style={styles.surfaceCap}>
                  <View style={styles.surfaceCapInner} />
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.rowWrapper}>
              <View style={{ width: metrics.rowWidth }}>
                <LeaderboardRow entry={item} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.statePanel}>
              {screen.isInitialLoading ? (
                <View
                  accessible
                  accessibilityLabel={t('leaderboard.loadingLabel')}
                >
                  <ActivityIndicator
                    color={colors.leaderboard.title}
                    size="large"
                  />
                </View>
              ) : screen.isInitialError ? (
                <>
                  <AppText accessibilityRole="alert" style={styles.stateTitle}>
                    {t('leaderboard.errorTitle')}
                  </AppText>
                  <AppText style={styles.stateText}>
                    {screen.errorMessage}
                  </AppText>
                  <Pressable
                    accessibilityLabel={t('leaderboard.retryLabel')}
                    accessibilityRole="button"
                    disabled={screen.isRetrying}
                    hitSlop={8}
                    onPress={screen.retry}
                    style={({ pressed }) => pressed && styles.buttonPressed}
                  >
                    <View style={styles.retryButton}>
                      {screen.isRetrying ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <AppText style={styles.retryText}>
                          {t('common.retry')}
                        </AppText>
                      )}
                    </View>
                  </Pressable>
                </>
              ) : screen.isEmpty ? (
                <>
                  <AppText style={styles.stateEmoji}>{'\u{1F31F}'}</AppText>
                  <AppText style={styles.stateTitle}>
                    {t('leaderboard.emptyTitle')}
                  </AppText>
                  <AppText style={styles.stateText}>
                    {t('leaderboard.emptyBody')}
                  </AppText>
                </>
              ) : null}
            </View>
          }
          ListFooterComponent={
            <View
              style={[
                hasEntries ? styles.footer : styles.emptyFooter,
                { paddingBottom: screen.contentBottomPadding },
              ]}
            >
              {screen.isLoadingNextPage ? (
                <View
                  accessible
                  accessibilityLabel={t('leaderboard.loadingMoreLabel')}
                >
                  <ActivityIndicator
                    color={colors.leaderboard.title}
                    size="small"
                  />
                </View>
              ) : null}

              {screen.footerErrorMessage ? (
                <>
                  <AppText accessibilityRole="alert" style={styles.footerText}>
                    {screen.footerErrorMessage}
                  </AppText>
                  <Pressable
                    accessibilityLabel={t('leaderboard.footerActionLabel', {
                      action: screen.footerActionLabel,
                    })}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={screen.retryFooterAction}
                    style={({ pressed }) => pressed && styles.buttonPressed}
                  >
                    <View style={styles.footerButton}>
                      <AppText style={styles.footerButtonText}>
                        {screen.footerActionLabel}
                      </AppText>
                    </View>
                  </Pressable>
                </>
              ) : null}
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.leaderboard.background,
  },

  safeArea: {
    flex: 1,
  },

  // Keeps the ranked surface behind the list so short result sets still reach
  // the bottom of the screen. It starts below the rounded cap so the corner
  // cut-outs keep showing the lavender background.
  listSurfaceLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.leaderboard.listSurface,
  },

  content: {
    flexGrow: 1,
  },

  header: {
    paddingTop: LEADERBOARD_TITLE_TOP,
    backgroundColor: colors.leaderboard.background,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  titleBar: {
    minHeight: 44,
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    zIndex: 2,
    start: 16,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },

  title: {
    color: colors.leaderboard.title,
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: LEADERBOARD_TITLE_LINE_HEIGHT,
    includeFontPadding: false,
    textAlign: 'center',
  },

  trophy: {
    fontSize: 21,
    lineHeight: LEADERBOARD_TITLE_LINE_HEIGHT,
    includeFontPadding: false,
  },

  subtitle: {
    marginTop: LEADERBOARD_SUBTITLE_GAP,
    color: colors.leaderboard.subtitle,
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: LEADERBOARD_SUBTITLE_LINE_HEIGHT,
    includeFontPadding: false,
    textAlign: 'center',
  },

  podium: {
    marginTop: LEADERBOARD_PODIUM_GAP,
  },

  surfaceCap: {
    height: LEADERBOARD_LIST_TOP_PADDING,
    overflow: 'hidden',
  },

  surfaceCapInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: LEADERBOARD_LIST_TOP_PADDING + LEADERBOARD_LIST_RADIUS,
    borderTopLeftRadius: LEADERBOARD_LIST_RADIUS,
    borderTopRightRadius: LEADERBOARD_LIST_RADIUS,
    backgroundColor: colors.leaderboard.listSurface,
  },

  rowWrapper: {
    alignItems: 'center',
    paddingBottom: LEADERBOARD_ROW_GAP,
    backgroundColor: colors.leaderboard.listSurface,
  },

  footer: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
    backgroundColor: colors.leaderboard.listSurface,
  },

  emptyFooter: {
    alignItems: 'center',
    gap: 12,
  },

  statePanel: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 48,
  },

  stateEmoji: {
    fontSize: 32,
    lineHeight: 38,
  },

  stateTitle: {
    color: colors.leaderboard.title,
    fontFamily: 'Fredoka',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    includeFontPadding: false,
    textAlign: 'center',
  },

  stateText: {
    color: colors.leaderboard.subtitle,
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    includeFontPadding: false,
    textAlign: 'center',
  },

  retryButton: {
    width: 140,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.muvBlue300,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  retryText: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    includeFontPadding: false,
  },

  footerText: {
    color: colors.leaderboard.rowScore,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    includeFontPadding: false,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  footerButton: {
    minHeight: 44,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 20,
    backgroundColor: colors.leaderboard.rankPill,
  },

  footerButtonText: {
    color: colors.leaderboard.rankPillText,
    fontFamily: 'Fredoka',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    includeFontPadding: false,
  },
});
