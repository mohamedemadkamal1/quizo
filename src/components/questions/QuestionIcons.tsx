import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { gameplayColors } from '@/constants/questions';

type IconProps = {
  size: number;
  color?: string;
};

export function GoldPauseGlyph({
  size,
  gradientId = 'goldPauseGradient',
  barInset = 15,
}: {
  size: number;
  gradientId?: string;
  barInset?: number;
}) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      <Defs>
        <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={gameplayColors.gold} />
          <Stop offset="1" stopColor={gameplayColors.orange} />
        </SvgLinearGradient>
      </Defs>
      <Rect
        x="25"
        y={barInset}
        width="20"
        height={100 - barInset * 2}
        rx="8"
        fill={`url(#${gradientId})`}
      />
      <Rect
        x="55"
        y={barInset}
        width="20"
        height={100 - barInset * 2}
        rx="8"
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
}

export function CloseGlyph({ size, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      <Line
        x1="13"
        y1="13"
        x2="35"
        y2="35"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="6"
      />
      <Line
        x1="35"
        y1="13"
        x2="13"
        y2="35"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="6"
      />
    </Svg>
  );
}

export function CheckGlyph({ size, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 28 28"
    >
      <Path
        d="M4.5 14.5 10.5 20 23.5 7.5"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </Svg>
  );
}

export function WrongGlyph({ size, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 28 28"
    >
      <Line
        x1="6"
        y1="6"
        x2="22"
        y2="22"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="4.5"
      />
      <Line
        x1="22"
        y1="6"
        x2="6"
        y2="22"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="4.5"
      />
    </Svg>
  );
}

export function ClockGlyph({ size }: { size: number }) {
  return (
    <View
      style={[
        styles.clockSurface,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Svg
        accessible={false}
        pointerEvents="none"
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
      >
        <Path
          d="M12 6v6l4 2"
          fill="none"
          stroke="#FFFFFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <Path
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
      </Svg>
    </View>
  );
}

export function SpeakerGlyph({
  active,
  size,
}: {
  active: boolean;
  size: number;
}) {
  const color = active ? gameplayColors.orange : gameplayColors.primaryText;

  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        fill={color}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      {active ? (
        <Rect x="17" y="7" width="2.6" height="10" rx="1" fill={color} />
      ) : (
        <>
          <Path
            d="M16 9.2c1.5 1.5 1.5 4.1 0 5.6"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <Path
            d="M18.7 6.7c2.9 2.9 2.9 7.7 0 10.6"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      )}
    </Svg>
  );
}

export function DoorGlyph({ size }: { size: number }) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      <Path
        d="M5 87h90"
        fill="none"
        stroke={gameplayColors.orange}
        strokeLinecap="round"
        strokeWidth="6"
      />
      <Path
        d="M20 87V23l52-10v74H20Z"
        fill="none"
        stroke={gameplayColors.orange}
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <Path
        d="M72 30h20v57"
        fill="none"
        stroke={gameplayColors.orange}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <Path
        d="M52 52h1"
        fill="none"
        stroke={gameplayColors.orange}
        strokeLinecap="round"
        strokeWidth="7"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  clockSurface: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gameplayColors.primaryText,
  },
});

export function SparkleGlyph({ size, color = gameplayColors.gold }: IconProps) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 28 28"
    >
      <Path
        d="M14 1.5c1.1 6.3 6.2 11.4 12.5 12.5C20.2 15.1 15.1 20.2 14 26.5 12.9 20.2 7.8 15.1 1.5 14 7.8 12.9 12.9 7.8 14 1.5Z"
        fill={color}
      />
    </Svg>
  );
}

export function SweatDropGlyph({ size, color = '#4FA8FF' }: IconProps) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 28 28"
    >
      <Path
        d="M14 2.5c4.6 5.6 8 10 8 14a8 8 0 0 1-16 0c0-4 3.4-8.4 8-14Z"
        fill={color}
      />
      <Path
        d="M10.4 17.2a4.2 4.2 0 0 0 1.5 4"
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </Svg>
  );
}
