import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { LeaderboardAvatar } from '@/components/leaderboard/LeaderboardAvatar';
import { colors } from '@/constants/colors';
import {
  LEADERBOARD_REFERENCE_WIDTH,
  PODIUM_BLOCK_BOTTOM,
  PODIUM_BLOCK_INSET,
  PODIUM_BLOCK_WIDTH,
  PODIUM_CENTER_BLOCK_TOP,
  PODIUM_CENTER_NUMBER_OFFSET,
  PODIUM_CROWN_GAP,
  PODIUM_EDGE_HIGHLIGHT,
  PODIUM_FIRST_BOTTOM_GAP,
  PODIUM_IDENTITY_GAP,
  PODIUM_MARK_DEPTH,
  PODIUM_MARK_HALF_WIDTH,
  PODIUM_MARK_OFFSET,
  PODIUM_REFERENCE_HEIGHT,
  PODIUM_SIDE_BLOCK_TOP,
  PODIUM_SIDE_BOTTOM_GAP,
  PODIUM_SIDE_NUMBER_OFFSET,
  PODIUM_SIDE_TOP_SLANT,
  PODIUM_SIDE_TOP_THICKNESS,
} from '@/constants/leaderboard';
import type { LeaderboardMetrics } from '@/constants/leaderboard';
import { useTranslation } from '@/hooks/useTranslation';
import type {
  LeaderboardPodiumEntry,
  LeaderboardPodiumPlace,
} from '@/types/leaderboard.types';

type LeaderboardPodiumProps = {
  entries: LeaderboardPodiumEntry[];
  metrics: LeaderboardMetrics;
};

const LEFT_BLOCK_X = PODIUM_BLOCK_INSET;
const CENTER_BLOCK_X = PODIUM_BLOCK_INSET + PODIUM_BLOCK_WIDTH;
const RIGHT_BLOCK_X = PODIUM_BLOCK_INSET + PODIUM_BLOCK_WIDTH * 2;

const SIDE_TOP_OUTER = PODIUM_SIDE_BLOCK_TOP + PODIUM_SIDE_TOP_SLANT;
const SIDE_FACE_OUTER = SIDE_TOP_OUTER + PODIUM_SIDE_TOP_THICKNESS;
const SIDE_FACE_INNER = PODIUM_SIDE_BLOCK_TOP + PODIUM_SIDE_TOP_THICKNESS;

const CENTER_NUMBER_Y = PODIUM_CENTER_BLOCK_TOP + PODIUM_CENTER_NUMBER_OFFSET;
const SIDE_NUMBER_Y = PODIUM_SIDE_BLOCK_TOP + PODIUM_SIDE_NUMBER_OFFSET;
const PODIUM_MARK_STROKE = 3.4;

/**
 * Slanted podium block for rank 2 (rising to the right) mirrored for rank 3.
 * The outer edge sits lower than the edge that meets the winner's block, which
 * is what gives the side podiums their trapezoid top surface.
 */
function getSideBlockShapes(place: 2 | 3) {
  const outerX =
    place === 2 ? LEFT_BLOCK_X : RIGHT_BLOCK_X + PODIUM_BLOCK_WIDTH;
  const innerX = place === 2 ? CENTER_BLOCK_X : RIGHT_BLOCK_X;

  return {
    topFace: [
      `${outerX},${SIDE_TOP_OUTER}`,
      `${innerX},${PODIUM_SIDE_BLOCK_TOP}`,
      `${innerX},${SIDE_FACE_INNER}`,
      `${outerX},${SIDE_FACE_OUTER}`,
    ].join(' '),
    frontFace: [
      `${outerX},${SIDE_FACE_OUTER}`,
      `${innerX},${SIDE_FACE_INNER}`,
      `${innerX},${PODIUM_BLOCK_BOTTOM}`,
      `${outerX},${PODIUM_BLOCK_BOTTOM}`,
    ].join(' '),
    edgeHighlight: [
      `${outerX},${SIDE_TOP_OUTER}`,
      `${innerX},${PODIUM_SIDE_BLOCK_TOP}`,
      `${innerX},${PODIUM_SIDE_BLOCK_TOP + PODIUM_EDGE_HIGHLIGHT}`,
      `${outerX},${SIDE_TOP_OUTER + PODIUM_EDGE_HIGHLIGHT}`,
    ].join(' '),
  };
}

/** The small white smile that sits under each podium number. */
function getMarkPath(centerX: number, numberCenterY: number) {
  const markY = numberCenterY + PODIUM_MARK_OFFSET;
  const startX = centerX - PODIUM_MARK_HALF_WIDTH;
  const endX = centerX + PODIUM_MARK_HALF_WIDTH;

  return `M ${startX} ${markY} Q ${centerX} ${markY + PODIUM_MARK_DEPTH} ${endX} ${markY}`;
}

function PodiumCrown({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      width={width}
      height={height}
      viewBox="0 0 30 24"
    >
      <Path
        d="M2.6 7.4 8.4 13.2 15 3.4 21.6 13.2 27.4 7.4 25.4 20.6H4.6Z"
        fill={colors.leaderboard.crown}
        stroke={colors.leaderboard.crown}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <Path
        d="M4.8 17.6h20.4"
        stroke={colors.leaderboard.crownShade}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PodiumNumber({
  metrics,
  value,
  blockX,
  centerY,
}: {
  metrics: LeaderboardMetrics;
  value: string;
  blockX: number;
  centerY: number;
}) {
  const lineHeight = metrics.numberFontSize * 1.16;

  return (
    // Physical `left` on purpose: the number has to stay centred over the
    // podium block drawn by the SVG below, whose coordinates never mirror.
    <AppText
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[
        styles.number,
        {
          left: blockX * metrics.podiumScale,
          width: metrics.blockWidth,
          top:
            metrics.podiumOverflow +
            centerY * metrics.podiumScale -
            lineHeight / 2,
          fontSize: metrics.numberFontSize,
          lineHeight,
        },
      ]}
    >
      {value}
    </AppText>
  );
}

function PodiumIdentity({
  entry,
  metrics,
  blockX,
}: {
  entry: LeaderboardPodiumEntry;
  metrics: LeaderboardMetrics;
  blockX: number;
}) {
  const { t } = useTranslation();
  const isFirst = entry.place === 1;

  return (
    <View
      accessible
      accessibilityLabel={entry.accessibilityLabel}
      style={[
        styles.identity,
        {
          left: blockX * metrics.podiumScale,
          width: metrics.blockWidth,
          height:
            metrics.podiumOverflow +
            (isFirst ? metrics.centerBlockTop : metrics.sideBlockTop),
          paddingBottom: isFirst
            ? PODIUM_FIRST_BOTTOM_GAP
            : PODIUM_SIDE_BOTTOM_GAP,
        },
      ]}
    >
      {isFirst ? (
        <View style={styles.crown}>
          <PodiumCrown
            width={metrics.crownWidth}
            height={metrics.crownHeight}
          />
        </View>
      ) : null}

      <LeaderboardAvatar
        initials={entry.initials}
        size={isFirst ? metrics.firstAvatarSize : metrics.sideAvatarSize}
        source={entry.avatarSource}
      />

      <AppText
        numberOfLines={1}
        style={[
          styles.name,
          {
            marginTop: PODIUM_IDENTITY_GAP,
            fontSize: metrics.nameFontSize,
            lineHeight: metrics.nameLineHeight,
          },
        ]}
      >
        {entry.displayName}
      </AppText>

      <View
        style={[
          styles.scorePill,
          {
            marginTop: PODIUM_IDENTITY_GAP,
            height: metrics.scorePillHeight,
            borderRadius: metrics.scorePillHeight / 2,
          },
        ]}
      >
        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          numberOfLines={1}
          style={[styles.score, { fontSize: metrics.scoreFontSize }]}
        >
          {t('leaderboard.points', { count: entry.totalScore })}
        </AppText>
      </View>
    </View>
  );
}

export function LeaderboardPodium({
  entries,
  metrics,
}: LeaderboardPodiumProps) {
  const byPlace = new Map<LeaderboardPodiumPlace, LeaderboardPodiumEntry>(
    entries.map((entry) => [entry.place, entry]),
  );
  const first = byPlace.get(1);
  const second = byPlace.get(2);
  const third = byPlace.get(3);
  const secondShapes = getSideBlockShapes(2);
  const thirdShapes = getSideBlockShapes(3);

  return (
    <View
      style={[
        styles.container,
        { width: metrics.podiumWidth, height: metrics.podiumSectionHeight },
      ]}
    >
      <Svg
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        width={metrics.podiumWidth}
        height={metrics.podiumArtHeight}
        viewBox={`0 0 ${LEADERBOARD_REFERENCE_WIDTH} ${PODIUM_REFERENCE_HEIGHT}`}
        style={[styles.art, { top: metrics.podiumOverflow }]}
      >
        <Defs>
          <SvgLinearGradient
            id="leaderboardPodiumFirst"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PODIUM_CENTER_BLOCK_TOP}
            x2="0"
            y2={PODIUM_BLOCK_BOTTOM}
          >
            <Stop offset="0" stopColor={colors.leaderboard.podiumFirstTop} />
            <Stop offset="0.13" stopColor={colors.leaderboard.podiumFirst} />
            <Stop offset="0.78" stopColor={colors.leaderboard.podiumFirst} />
            <Stop
              offset="1"
              stopColor={colors.leaderboard.podiumFirst}
              stopOpacity="0"
            />
          </SvgLinearGradient>

          <SvgLinearGradient
            id="leaderboardPodiumSecond"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PODIUM_SIDE_BLOCK_TOP}
            x2="0"
            y2={PODIUM_BLOCK_BOTTOM}
          >
            <Stop offset="0" stopColor={colors.leaderboard.podiumSecond} />
            <Stop offset="0.76" stopColor={colors.leaderboard.podiumSecond} />
            <Stop
              offset="1"
              stopColor={colors.leaderboard.podiumSecond}
              stopOpacity="0"
            />
          </SvgLinearGradient>

          <SvgLinearGradient
            id="leaderboardPodiumThird"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PODIUM_SIDE_BLOCK_TOP}
            x2="0"
            y2={PODIUM_BLOCK_BOTTOM}
          >
            <Stop offset="0" stopColor={colors.leaderboard.podiumThird} />
            <Stop offset="0.76" stopColor={colors.leaderboard.podiumThird} />
            <Stop
              offset="1"
              stopColor={colors.leaderboard.podiumThird}
              stopOpacity="0"
            />
          </SvgLinearGradient>
        </Defs>

        {second ? (
          <>
            <Polygon
              points={secondShapes.frontFace}
              fill="url(#leaderboardPodiumSecond)"
            />
            <Polygon
              points={secondShapes.topFace}
              fill={colors.leaderboard.podiumSecondTop}
            />
            <Polygon
              points={secondShapes.edgeHighlight}
              fill={colors.leaderboard.podiumEdgeHighlight}
            />
            <Path
              d={getMarkPath(
                LEFT_BLOCK_X + PODIUM_BLOCK_WIDTH / 2,
                SIDE_NUMBER_Y,
              )}
              fill="none"
              stroke={colors.leaderboard.podiumMark}
              strokeWidth={PODIUM_MARK_STROKE}
              strokeLinecap="round"
            />
          </>
        ) : null}

        {third ? (
          <>
            <Polygon
              points={thirdShapes.frontFace}
              fill="url(#leaderboardPodiumThird)"
            />
            <Polygon
              points={thirdShapes.topFace}
              fill={colors.leaderboard.podiumThirdTop}
            />
            <Polygon
              points={thirdShapes.edgeHighlight}
              fill={colors.leaderboard.podiumEdgeHighlight}
            />
            <Path
              d={getMarkPath(
                RIGHT_BLOCK_X + PODIUM_BLOCK_WIDTH / 2,
                SIDE_NUMBER_Y,
              )}
              fill="none"
              stroke={colors.leaderboard.podiumMark}
              strokeWidth={PODIUM_MARK_STROKE}
              strokeLinecap="round"
            />
          </>
        ) : null}

        {first ? (
          <>
            <Rect
              x={CENTER_BLOCK_X}
              y={PODIUM_CENTER_BLOCK_TOP}
              width={PODIUM_BLOCK_WIDTH}
              height={PODIUM_BLOCK_BOTTOM - PODIUM_CENTER_BLOCK_TOP}
              fill="url(#leaderboardPodiumFirst)"
            />
            <Rect
              x={CENTER_BLOCK_X}
              y={PODIUM_CENTER_BLOCK_TOP}
              width={PODIUM_BLOCK_WIDTH}
              height={PODIUM_EDGE_HIGHLIGHT}
              fill={colors.leaderboard.podiumEdgeHighlight}
            />
            <Path
              d={getMarkPath(
                CENTER_BLOCK_X + PODIUM_BLOCK_WIDTH / 2,
                CENTER_NUMBER_Y,
              )}
              fill="none"
              stroke={colors.leaderboard.podiumMark}
              strokeWidth={PODIUM_MARK_STROKE}
              strokeLinecap="round"
            />
          </>
        ) : null}
      </Svg>

      {second ? (
        <PodiumNumber
          metrics={metrics}
          value="2"
          blockX={LEFT_BLOCK_X}
          centerY={SIDE_NUMBER_Y}
        />
      ) : null}

      {third ? (
        <PodiumNumber
          metrics={metrics}
          value="3"
          blockX={RIGHT_BLOCK_X}
          centerY={SIDE_NUMBER_Y}
        />
      ) : null}

      {first ? (
        <PodiumNumber
          metrics={metrics}
          value="1"
          blockX={CENTER_BLOCK_X}
          centerY={CENTER_NUMBER_Y}
        />
      ) : null}

      {second ? (
        <PodiumIdentity
          entry={second}
          metrics={metrics}
          blockX={LEFT_BLOCK_X}
        />
      ) : null}

      {third ? (
        <PodiumIdentity
          entry={third}
          metrics={metrics}
          blockX={RIGHT_BLOCK_X}
        />
      ) : null}

      {first ? (
        <PodiumIdentity
          entry={first}
          metrics={metrics}
          blockX={CENTER_BLOCK_X}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },

  art: {
    position: 'absolute',
    left: 0,
  },

  number: {
    position: 'absolute',
    color: colors.leaderboard.podiumNumber,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },

  identity: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },

  crown: {
    marginBottom: PODIUM_CROWN_GAP,
  },

  name: {
    maxWidth: '100%',
    color: colors.leaderboard.podiumName,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },

  scorePill: {
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    backgroundColor: colors.leaderboard.scorePill,
  },

  score: {
    color: colors.leaderboard.scorePillText,
    fontFamily: 'Nunito',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
