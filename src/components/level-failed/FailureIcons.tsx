import Svg, { Path, Rect } from "react-native-svg";

import { levelFailedColors } from "@/constants/level-failed";

type IconProps = { size: number };

export function FailureCheckIcon({ size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Rect width="27" height="27" x="2.5" y="2.5" rx="5" fill="#C9F1D5" />
      <Rect
        width="23"
        height="23"
        x="4.5"
        y="4.5"
        rx="4"
        fill={levelFailedColors.green}
      />
      <Path
        d="m9.5 16.2 4.2 4.3 8.8-10"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </Svg>
  );
}

export function FailureWrongIcon({ size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="m9 9 14 14M23 9 9 23"
        fill="none"
        stroke={levelFailedColors.red}
        strokeLinecap="square"
        strokeWidth="4.5"
      />
    </Svg>
  );
}

export function FailureBoltIcon({ size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="m18.4 2.5-10 15h7l-1.8 12 10-16h-7l1.8-11Z"
        fill="#FFF5C2"
        stroke={levelFailedColors.yellow}
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </Svg>
  );
}

export function FailureRankingIcon({ size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Path
        d="M5 5v26h26"
        fill="none"
        stroke="#8DA7CB"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Path
        d="m8 9 7 5 5-3 8 9"
        fill="none"
        stroke="#2679C9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </Svg>
  );
}

export function FailureChevronIcon({ size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m9 5 7 7-7 7"
        fill="none"
        stroke={levelFailedColors.red}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </Svg>
  );
}
