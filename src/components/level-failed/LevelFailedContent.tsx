import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { CompletionStar } from "@/components/level-complete/CompletionIcons";
import {
  FailureBoltIcon,
  FailureCheckIcon,
  FailureChevronIcon,
  FailureRankingIcon,
  FailureWrongIcon,
} from "@/components/level-failed/FailureIcons";
import { FailureProgressRing } from "@/components/level-failed/FailureProgressRing";
import { FailureStatCard } from "@/components/level-failed/FailureStatCard";
import {
  LEVEL_FAILED_MAX_WIDTH,
  LEVEL_FAILED_REFERENCE_CONTENT_HEIGHT,
  LEVEL_FAILED_REFERENCE_WIDTH,
  levelFailedColors,
  levelFailedGradients,
} from "@/constants/level-failed";
import type { useLevelFailedScreen } from "@/hooks/level-failed/useLevelFailedScreen";

type LevelFailedContentProps = {
  screen: ReturnType<typeof useLevelFailedScreen>;
};

function FailureDecorations({
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
        { width: 390 * scale, height: 797 * verticalScale },
      ]}
    >
      <Path
        d="m27 63 1.6 3.7 4 .4-3.1 2.6 1 4-3.5-2.1-3.5 2.1 1-4-3.1-2.6 4-.4L27 63Z"
        fill={levelFailedColors.gold}
        opacity="0.28"
      />
      <Path
        d="m363 43 1.4 3.4 3.7.3-2.8 2.5.9 3.6-3.2-1.9-3.2 1.9.9-3.6-2.8-2.5 3.7-.3 1.4-3.4Z"
        fill="#F1A5A8"
        opacity="0.7"
      />
      <Path
        d="m373 252 1.4 3.4 3.7.3-2.8 2.5.9 3.6-3.2-1.9-3.2 1.9.9-3.6-2.8-2.5 3.7-.3 1.4-3.4Z"
        fill="#64E6C3"
        opacity="0.52"
      />
    </Svg>
  );
}

function FailureActionButton({
  label,
  accessibilityLabel,
  primary = false,
  loading = false,
  disabled = false,
  scale,
  verticalScale,
  top,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  primary?: boolean;
  loading?: boolean;
  disabled?: boolean;
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
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          top: top * verticalScale,
          left: 24 * scale,
          width,
          height: (primary ? 60 : 55) * verticalScale,
          opacity: disabled && !loading ? 0.55 : 1,
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
                  ? levelFailedColors.redShadow
                  : "rgba(71, 85, 105, 0.22)",
              },
            ]}
          />

          {primary ? (
            <LinearGradient
              colors={levelFailedGradients.primaryButton}
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
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  style={[
                    styles.primaryActionLabel,
                    { fontSize: 17 * scale, lineHeight: 23 * scale },
                  ]}
                >
                  {label}
                </Text>
              )}
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
              <Text
                style={[
                  styles.secondaryActionLabel,
                  { fontSize: 16 * scale, lineHeight: 22 * scale },
                ]}
              >
                {label}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function LevelFailedContent({ screen }: LevelFailedContentProps) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { summary } = screen;

  if (!summary) {
    return (
      <SafeAreaView style={styles.invalidSafeArea}>
        <View style={styles.invalidPanel}>
          <Text accessibilityRole="alert" style={styles.invalidMessage}>
            This failed-level result is invalid.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={screen.handleBackToMap}
            style={styles.invalidAction}
          >
            <Text style={styles.invalidActionLabel}>Return</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const contentWidth = Math.min(windowWidth, LEVEL_FAILED_MAX_WIDTH);
  const scale = contentWidth / LEVEL_FAILED_REFERENCE_WIDTH;
  const availableHeight = windowHeight - insets.top - insets.bottom;
  const verticalScale = Math.min(
    scale,
    availableHeight / LEVEL_FAILED_REFERENCE_CONTENT_HEIGHT,
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={[styles.surface, { width: contentWidth }]}>
        <FailureDecorations scale={scale} verticalScale={verticalScale} />

        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            {
              top: 14 * verticalScale,
              fontSize: 28 * scale,
              lineHeight: 35 * scale,
            },
          ]}
        >
          Level Failed!
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              top: 50 * verticalScale,
              fontSize: 12 * scale,
              lineHeight: 17 * scale,
              letterSpacing: 2.3 * scale,
            },
          ]}
        >
          BETTER LUCK NEXT TIME
        </Text>

        <View
          style={[
            styles.progress,
            { top: 100 * verticalScale, left: 127 * scale },
          ]}
        >
          <FailureProgressRing
            correctAnswers={summary.correctAnswers}
            scale={scale}
            totalQuestions={summary.totalAnswers}
          />
        </View>

        <View
          accessibilityLabel={`${screen.earnedStars} out of three stars`}
          style={[
            styles.stars,
            {
              top: 245 * verticalScale,
              left: 126 * scale,
              gap: 9 * scale,
            },
          ]}
        >
          {[0, 1, 2].map((index) => (
            <CompletionStar
              key={index}
              color={
                index < screen.earnedStars
                  ? levelFailedColors.gold
                  : levelFailedColors.track
              }
              size={38 * scale}
            />
          ))}
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.encouragement,
            {
              top: 306 * verticalScale,
              left: 28 * scale,
              width: 255 * scale,
            },
          ]}
        >
          <Text
            style={[
              styles.encouragementTitle,
              { fontSize: 25 * scale, lineHeight: 33 * scale },
            ]}
          >
            Don&apos;t Give Up! 💪
          </Text>
          <Text
            style={[
              styles.encouragementSubtitle,
              { fontSize: 15 * scale, lineHeight: 21 * scale },
            ]}
          >
            Try again!
          </Text>
        </View>

        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[
            styles.mascotSlot,
            {
              top: 257 * verticalScale,
              left: 267 * scale,
              width: 99 * scale,
              height: 137 * verticalScale,
            },
          ]}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={require("../../assets/images/level-failed-mascot.png")}
            style={styles.mascot}
          />
        </View>

        <View
          style={[
            styles.stats,
            { top: 380 * verticalScale, left: 24 * scale, gap: 12 * scale },
          ]}
        >
          <FailureStatCard
            icon={<FailureCheckIcon size={29 * scale} />}
            label="Correct"
            scale={scale}
            value={summary.correctAnswers}
            verticalScale={verticalScale}
          />
          <FailureStatCard
            icon={<FailureWrongIcon size={29 * scale} />}
            label="Wrong"
            scale={scale}
            value={summary.wrongAnswers}
            verticalScale={verticalScale}
          />
          <FailureStatCard
            icon={<FailureBoltIcon size={29 * scale} />}
            label="Points"
            scale={scale}
            value={summary.xpEarned}
            verticalScale={verticalScale}
          />
        </View>

        <Pressable
          accessibilityHint="Opens the Leaderboard tab"
          accessibilityLabel="Keep climbing the ranks. Win to climb the ranks"
          accessibilityRole="button"
          disabled={screen.isRetrying}
          onPress={screen.handleLeaderboard}
          style={[
            styles.ranking,
            {
              top: 512 * verticalScale,
              left: 24 * scale,
              width: 342 * scale,
              height: 69 * verticalScale,
              borderRadius: 17 * scale,
              paddingHorizontal: 17 * scale,
              gap: 12 * scale,
            },
          ]}
        >
          <FailureRankingIcon size={30 * scale} />
          <View style={styles.rankingCopy}>
            <Text
              numberOfLines={1}
              style={[
                styles.rankingTitle,
                { fontSize: 14 * scale, lineHeight: 19 * scale },
              ]}
            >
              Keep climbing the ranks!
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.rankingSupporting,
                { fontSize: 12 * scale, lineHeight: 16 * scale },
              ]}
            >
              Win to climb the ranks
            </Text>
          </View>
          <FailureChevronIcon size={22 * scale} />
        </Pressable>

        {screen.retryErrorMessage ? (
          <Text
            accessibilityRole="alert"
            numberOfLines={1}
            style={[
              styles.retryError,
              {
                top: 583 * verticalScale,
                left: 24 * scale,
                width: 342 * scale,
                fontSize: 11 * scale,
                lineHeight: 15 * scale,
              },
            ]}
          >
            {screen.retryErrorMessage}
          </Text>
        ) : null}

        <FailureActionButton
          accessibilityLabel="Try this level again"
          disabled={screen.isRetrying}
          label="Try Again →"
          loading={screen.isRetrying}
          onPress={screen.handleTryAgain}
          primary
          scale={scale}
          top={602}
          verticalScale={verticalScale}
        />
        <FailureActionButton
          accessibilityLabel="Back to level map"
          disabled={screen.isRetrying}
          label="Back To Map →"
          onPress={screen.handleBackToMap}
          scale={scale}
          top={666}
          verticalScale={verticalScale}
        />
        <FailureActionButton
          accessibilityLabel="Go to Home"
          disabled={screen.isRetrying}
          label="Go to Home 🏠"
          onPress={screen.handleHome}
          scale={scale}
          top={728}
          verticalScale={verticalScale}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F0F2F5",
  },
  surface: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: levelFailedColors.background,
  },
  decorations: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  title: {
    position: "absolute",
    right: 0,
    left: 0,
    color: levelFailedColors.heading,
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  subtitle: {
    position: "absolute",
    right: 0,
    left: 0,
    color: levelFailedColors.subtitle,
    fontFamily: "Nunito",
    fontWeight: "500",
    includeFontPadding: false,
    textAlign: "center",
  },
  progress: {
    position: "absolute",
  },
  stars: {
    position: "absolute",
    flexDirection: "row",
  },
  encouragement: {
    position: "absolute",
    zIndex: 2,
    alignItems: "center",
  },
  encouragementTitle: {
    color: levelFailedColors.heading,
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  encouragementSubtitle: {
    marginTop: 2,
    color: levelFailedColors.primaryText,
    fontFamily: "Fredoka",
    fontWeight: "500",
    includeFontPadding: false,
    textAlign: "center",
  },
  mascotSlot: {
    position: "absolute",
    zIndex: 1,
  },
  mascot: {
    width: "100%",
    height: "100%",
  },
  stats: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
  },
  ranking: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: levelFailedColors.red,
    backgroundColor: levelFailedColors.surface,
  },
  rankingCopy: {
    flex: 1,
  },
  rankingTitle: {
    color: levelFailedColors.heading,
    fontFamily: "Nunito",
    fontWeight: "700",
    includeFontPadding: false,
  },
  rankingSupporting: {
    color: levelFailedColors.muted,
    fontFamily: "Nunito",
    fontWeight: "500",
    includeFontPadding: false,
  },
  retryError: {
    position: "absolute",
    zIndex: 4,
    color: "#B42318",
    fontFamily: "Nunito",
    fontWeight: "700",
    textAlign: "center",
  },
  actionButton: {
    position: "absolute",
  },
  actionVisual: {
    flex: 1,
  },
  actionPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  actionShadow: {
    position: "absolute",
    left: 0,
  },
  actionSurface: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  secondarySurface: {
    borderWidth: 1,
    borderColor: "rgba(163, 179, 255, 0.55)",
    backgroundColor: "#F0F2F5",
  },
  primaryActionLabel: {
    color: "#FFFFFF",
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  secondaryActionLabel: {
    color: levelFailedColors.primaryText,
    fontFamily: "Fredoka",
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  invalidSafeArea: {
    flex: 1,
    backgroundColor: levelFailedColors.background,
  },
  invalidPanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    padding: 24,
  },
  invalidMessage: {
    color: levelFailedColors.heading,
    fontFamily: "Fredoka",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  invalidAction: {
    minWidth: 150,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: levelFailedColors.surface,
  },
  invalidActionLabel: {
    color: levelFailedColors.primaryText,
    fontFamily: "Fredoka",
    fontSize: 17,
    fontWeight: "600",
  },
});
