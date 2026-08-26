import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import {
  CompletionChevron,
  CompletionStar,
} from '@/components/level-complete/CompletionIcons';
import { CompletionProgressRing } from '@/components/level-complete/CompletionProgressRing';
import { CompletionStatCard } from '@/components/level-complete/CompletionStatCard';
import { RatePromptModal } from '@/components/review/RatePromptModal';
import {
  LEVEL_COMPLETE_MAX_WIDTH,
  LEVEL_COMPLETE_REFERENCE_CONTENT_HEIGHT,
  LEVEL_COMPLETE_REFERENCE_WIDTH,
  levelCompleteColors,
  levelCompleteGradients,
} from '@/constants/level-complete';
import type { useLevelCompleteScreen } from '@/hooks/level-complete/useLevelCompleteScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { getEarnedStars } from '@/utils/get-earned-stars';

type LevelCompleteContentProps = {
  screen: ReturnType<typeof useLevelCompleteScreen>;
};

function formatDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function CompletionDecorations({
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
      viewBox="0 0 390 797"
      style={[
        styles.decorations,
        {
          width: 390 * scale,
          height: 797 * verticalScale,
        },
      ]}
    >
      <Path
        d="m27 63 1.6 3.7 4 .4-3.1 2.6 1 4-3.5-2.1-3.5 2.1 1-4-3.1-2.6 4-.4L27 63Z"
        fill={levelCompleteColors.gold}
        opacity="0.32"
      />
      <Path
        d="m363 43 1.4 3.4 3.7.3-2.8 2.5.9 3.6-3.2-1.9-3.2 1.9.9-3.6-2.8-2.5 3.7-.3 1.4-3.4Z"
        fill={levelCompleteColors.orange}
        opacity="0.42"
      />
      <Path
        d="m373 526 1.4 3.4 3.7.3-2.8 2.5.9 3.6-3.2-1.9-3.2 1.9.9-3.6-2.8-2.5 3.7-.3 1.4-3.4Z"
        fill={levelCompleteColors.green}
        opacity="0.45"
      />
    </Svg>
  );
}

function CompletionActionButton({
  label,
  accessibilityLabel,
  primary = false,
  scale,
  verticalScale,
  top,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  primary?: boolean;
  scale: number;
  verticalScale: number;
  top: number;
  onPress: () => void;
}) {
  const width = 342 * scale;
  const surfaceHeight = (primary ? 53 : 50) * verticalScale;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          top: top * verticalScale,
          left: 24 * scale,
          width,
          height: (primary ? 60 : 55) * verticalScale,
        },
      ]}
    >
      {({ pressed }) => (
        <View style={[styles.actionVisual, pressed && styles.actionPressed]}>
          <View
            style={[
              styles.actionShadow,
              {
                top: (primary ? 7 : 5) * verticalScale,
                width,
                height: surfaceHeight,
                borderRadius: 28 * scale,
                backgroundColor: primary
                  ? levelCompleteColors.orange
                  : 'rgba(71, 85, 105, 0.22)',
              },
            ]}
          />

          {primary ? (
            <LinearGradient
              colors={levelCompleteGradients.primaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.actionSurface,
                {
                  width,
                  height: surfaceHeight,
                  borderRadius: 28 * scale,
                },
              ]}
            >
              <AppText
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                numberOfLines={1}
                style={[
                  styles.primaryActionLabel,
                  { fontSize: 17 * scale, lineHeight: 23 * scale },
                ]}
              >
                {label}
              </AppText>
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.actionSurface,
                styles.secondarySurface,
                {
                  width,
                  height: surfaceHeight,
                  borderRadius: 28 * scale,
                },
              ]}
            >
              <AppText
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                numberOfLines={1}
                style={[
                  styles.secondaryActionLabel,
                  { fontSize: 16 * scale, lineHeight: 22 * scale },
                ]}
              >
                {label}
              </AppText>
              <AppText
                accessible={false}
                style={{ fontSize: 18 * scale, lineHeight: 23 * scale }}
              >
                🏠
              </AppText>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function LevelCompleteContent({ screen }: LevelCompleteContentProps) {
  const { t, formatNumber } = useTranslation();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { summary, isPerfect } = screen;

  if (!summary) {
    return (
      <SafeAreaView style={styles.invalidSafeArea}>
        <View style={styles.invalidPanel}>
          <AppText accessibilityRole="alert" style={styles.invalidMessage}>
            {t('levelComplete.invalid')}
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={screen.handleBackToMap}
            style={styles.invalidAction}
          >
            <AppText style={styles.invalidActionLabel}>
              {t('common.return')}
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const contentWidth = Math.min(windowWidth, LEVEL_COMPLETE_MAX_WIDTH);
  const scale = contentWidth / LEVEL_COMPLETE_REFERENCE_WIDTH;
  const availableHeight = windowHeight - insets.top - insets.bottom;
  const verticalScale = Math.min(
    scale,
    availableHeight / LEVEL_COMPLETE_REFERENCE_CONTENT_HEIGHT,
  );
  const earnedStars = getEarnedStars(
    summary.correctAnswers,
    summary.totalAnswers,
  );
  const formattedDuration = formatDuration(summary.durationSeconds);
  const xpLabel =
    summary.isReplay && summary.xpEarned === 0
      ? t('levelComplete.replayNoXp')
      : t('levelComplete.xpEarned', { xp: formatNumber(summary.xpEarned) });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.surface,
          {
            width: contentWidth,
          },
        ]}
      >
        <CompletionDecorations scale={scale} verticalScale={verticalScale} />

        <AppText
          accessibilityRole="header"
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[
            styles.title,
            {
              top: 19 * verticalScale,
              fontSize: 28 * scale,
              lineHeight: 35 * scale,
            },
          ]}
        >
          {t('levelComplete.title')}
        </AppText>
        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[
            styles.milestone,
            {
              top: 54 * verticalScale,
              fontSize: 12 * scale,
              lineHeight: 17 * scale,
              letterSpacing: 2.4 * scale,
            },
          ]}
        >
          {t('levelComplete.milestone')}
        </AppText>

        <View
          style={[
            styles.progress,
            { top: 101 * verticalScale, left: 127 * scale },
          ]}
        >
          <CompletionProgressRing
            correctAnswers={summary.correctAnswers}
            isPerfect={isPerfect}
            scale={scale}
            totalQuestions={summary.totalAnswers}
          />
        </View>

        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[
            styles.stars,
            {
              top: 245 * verticalScale,
              left: 125 * scale,
              gap: 9 * scale,
            },
          ]}
        >
          {[0, 1, 2].map((index) => (
            <CompletionStar
              key={index}
              color={
                index < earnedStars
                  ? isPerfect
                    ? levelCompleteColors.green
                    : levelCompleteColors.gold
                  : levelCompleteColors.track
              }
              size={38 * scale}
            />
          ))}
        </View>

        {isPerfect ? (
          <View
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={[
              styles.characterSlot,
              {
                top: 198 * verticalScale,
                left: 15 * scale,
                width: 112 * scale,
                height: 206 * scale,
              },
            ]}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={require('../../assets/images/illustrations/level-complete/celebrating-character.png')}
              style={styles.character}
            />
          </View>
        ) : null}

        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[
            styles.praise,
            {
              top: 307 * verticalScale,
              fontSize: 26 * scale,
              lineHeight: 34 * scale,
            },
          ]}
        >
          {isPerfect
            ? t('levelComplete.praisePerfect')
            : t('levelComplete.praiseGood')}
        </AppText>
        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[
            styles.supporting,
            {
              top: 347 * verticalScale,
              fontSize: 15 * scale,
              lineHeight: 21 * scale,
            },
          ]}
        >
          {isPerfect
            ? t('levelComplete.supportingPerfect')
            : t('levelComplete.supportingGood')}
        </AppText>

        <View
          style={[
            styles.stats,
            {
              top: 384 * verticalScale,
              left: 24 * scale,
              gap: 12 * scale,
            },
          ]}
        >
          <CompletionStatCard
            icon="✅"
            label={t('levelComplete.statCorrect')}
            scale={scale}
            value={summary.correctAnswers}
            valueColor={
              isPerfect
                ? levelCompleteColors.green
                : levelCompleteColors.heading
            }
            verticalScale={verticalScale}
          />
          <CompletionStatCard
            icon="❌"
            label={t('levelComplete.statWrong')}
            scale={scale}
            value={summary.wrongAnswers}
            verticalScale={verticalScale}
          />
          <CompletionStatCard
            icon="⚡"
            label={t('levelComplete.statScore')}
            scale={scale}
            value={summary.score}
            verticalScale={verticalScale}
          />
        </View>

        <Pressable
          accessibilityLabel={t('levelComplete.rankingLabel', {
            xp: xpLabel,
            duration: formattedDuration,
          })}
          accessibilityHint={t('levelComplete.rankingHint')}
          accessibilityRole="button"
          android_ripple={{ color: 'rgba(72, 91, 221, 0.08)' }}
          onPress={screen.handleLeaderboard}
          style={[
            styles.ranking,
            {
              top: 518 * verticalScale,
              left: 24 * scale,
              width: 342 * scale,
              height: 68 * verticalScale,
              borderRadius: 17 * scale,
              paddingHorizontal: 19 * scale,
              gap: 12 * scale,
            },
          ]}
        >
          <AppText
            accessible={false}
            style={{ fontSize: 25 * scale, lineHeight: 31 * scale }}
          >
            🥇
          </AppText>
          <View style={styles.rankingCopy}>
            <AppText
              numberOfLines={1}
              style={[
                styles.rankingTitle,
                { fontSize: 14 * scale, lineHeight: 19 * scale },
              ]}
            >
              {xpLabel}
            </AppText>
            <AppText
              numberOfLines={1}
              style={[
                styles.rankingSupporting,
                { fontSize: 12 * scale, lineHeight: 16 * scale },
              ]}
            >
              {t('levelComplete.completedIn', { duration: formattedDuration })}
            </AppText>
          </View>
          <CompletionChevron size={24 * scale} />
        </Pressable>

        <CompletionActionButton
          accessibilityLabel={t('levelComplete.backToMapLabel')}
          label={t('levelComplete.backToMap')}
          onPress={screen.handleBackToMap}
          primary
          scale={scale}
          top={607}
          verticalScale={verticalScale}
        />
        <CompletionActionButton
          accessibilityLabel={t('levelComplete.goHomeLabel')}
          label={t('levelComplete.goHome')}
          onPress={screen.handleHome}
          scale={scale}
          top={670}
          verticalScale={verticalScale}
        />
      </View>

      {screen.reviewPrompt.isVisible ? (
        <RatePromptModal
          isOpeningStore={screen.reviewPrompt.isOpeningStore}
          onDismiss={screen.reviewPrompt.dismiss}
          onRate={screen.reviewPrompt.openReview}
          onSelectStars={screen.reviewPrompt.selectStars}
          selectedStars={screen.reviewPrompt.selectedStars}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  surface: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: levelCompleteColors.background,
  },
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    position: 'absolute',
    right: 0,
    left: 0,
    color: levelCompleteColors.heading,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  milestone: {
    position: 'absolute',
    right: 0,
    left: 0,
    color: levelCompleteColors.primaryText,
    fontFamily: 'Nunito',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
  },
  stars: {
    position: 'absolute',
    zIndex: 2,
    flexDirection: 'row',
  },
  characterSlot: {
    position: 'absolute',
    zIndex: 1,
  },
  character: {
    width: '100%',
    height: '100%',
  },
  praise: {
    position: 'absolute',
    zIndex: 2,
    right: 0,
    left: 0,
    color: levelCompleteColors.heading,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  supporting: {
    position: 'absolute',
    right: 0,
    left: 0,
    color: levelCompleteColors.primaryText,
    fontFamily: 'Fredoka',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
  },
  stats: {
    position: 'absolute',
    zIndex: 3,
    flexDirection: 'row',
  },
  ranking: {
    position: 'absolute',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: levelCompleteColors.border,
    backgroundColor: levelCompleteColors.surface,
  },
  rankingCopy: {
    minWidth: 0,
    flex: 1,
  },
  rankingTitle: {
    color: levelCompleteColors.heading,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
  },
  rankingSupporting: {
    color: levelCompleteColors.muted,
    fontFamily: 'Fredoka',
    fontWeight: '400',
    includeFontPadding: false,
  },
  actionButton: {
    position: 'absolute',
    zIndex: 4,
  },
  actionVisual: {
    flex: 1,
  },
  actionPressed: {
    opacity: 0.88,
    transform: [{ translateY: 2 }, { scale: 0.995 }],
  },
  actionShadow: {
    position: 'absolute',
    left: 0,
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },
  actionSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  secondarySurface: {
    borderWidth: 1,
    borderColor: 'rgba(163, 179, 255, 0.7)',
    backgroundColor: levelCompleteColors.track,
  },
  primaryActionLabel: {
    minWidth: 0,
    flexShrink: 1,
    color: levelCompleteColors.surface,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  secondaryActionLabel: {
    minWidth: 0,
    flexShrink: 1,
    color: levelCompleteColors.primaryText,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  invalidSafeArea: {
    flex: 1,
    backgroundColor: levelCompleteColors.background,
  },
  invalidPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  invalidMessage: {
    color: levelCompleteColors.heading,
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  invalidAction: {
    minWidth: 150,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: levelCompleteColors.surface,
  },
  invalidActionLabel: {
    color: levelCompleteColors.primaryText,
    fontFamily: 'Fredoka',
    fontSize: 17,
    fontWeight: '600',
  },
});
