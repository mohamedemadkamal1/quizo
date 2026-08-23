import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { getDirectionalIconStyle } from '@/theme/direction-styles';

export type ProfileIconName =
  | 'chevron'
  | 'close'
  | 'edit'
  | 'eye'
  | 'globe'
  | 'lock'
  | 'logout'
  | 'progress'
  | 'trash';

type ProfileIconProps = {
  name: ProfileIconName;
  color: string;
  size?: number;
};

export function ProfileIcon({ name, color, size = 22 }: ProfileIconProps) {
  const { isRTL } = useLanguageDirection();
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
  } as const;

  if (name === 'close') {
    return (
      <Svg {...commonProps}>
        <Line
          x1="5"
          y1="5"
          x2="19"
          y2="19"
          stroke={color}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <Line
          x1="19"
          y1="5"
          x2="5"
          y2="19"
          stroke={color}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'edit') {
    return (
      <Svg {...commonProps}>
        <Path
          d="M13.5 6.5 17.5 10.5M4.5 19.5l3.9-.8L18.2 8.9a2.1 2.1 0 0 0-3-3L5.3 15.7l-.8 3.8Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'lock') {
    return (
      <Svg {...commonProps}>
        <Path
          d="M7.5 10V7.7a4.5 4.5 0 0 1 9 0V10M6.7 10h10.6a1.7 1.7 0 0 1 1.7 1.7v7.1a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 18.8v-7.1A1.7 1.7 0 0 1 6.7 10Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="15" r="1" fill={color} />
      </Svg>
    );
  }

  if (name === 'logout') {
    // The door-and-arrow glyph points the way out, so it follows the reading
    // direction like the chevron below.
    return (
      <Svg {...commonProps} style={getDirectionalIconStyle(isRTL)}>
        <Path
          d="M10 5H6.8A1.8 1.8 0 0 0 5 6.8v10.4A1.8 1.8 0 0 0 6.8 19H10M14 8l4 4-4 4M18 12H9"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'trash') {
    return (
      <Svg {...commonProps}>
        <Path
          d="M5 7h14M9 7V4.8h6V7M7 7l.7 12h8.6L17 7M10 10.5v5M14 10.5v5"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'progress') {
    return (
      <Svg {...commonProps}>
        <Rect
          x="4"
          y="13"
          width="3"
          height="6"
          rx="1"
          stroke={color}
          strokeWidth={1.6}
        />
        <Rect
          x="10.5"
          y="9"
          width="3"
          height="10"
          rx="1"
          stroke={color}
          strokeWidth={1.6}
        />
        <Rect
          x="17"
          y="5"
          width="3"
          height="14"
          rx="1"
          stroke={color}
          strokeWidth={1.6}
        />
      </Svg>
    );
  }

  if (name === 'globe') {
    return (
      <Svg {...commonProps}>
        <Circle cx="12" cy="12" r="8.4" stroke={color} strokeWidth={1.8} />
        <Path
          d="M3.6 12h16.8M12 3.6c2.2 2.3 3.4 5.3 3.4 8.4S14.2 18.1 12 20.4C9.8 18.1 8.6 15.1 8.6 12S9.8 5.9 12 3.6Z"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.8}
        />
      </Svg>
    );
  }

  if (name === 'eye') {
    return (
      <Svg {...commonProps}>
        <Path
          d="M3 12s3.3-5 9-5 9 5 9 5-3.3 5-9 5-9-5-9-5Z"
          stroke={color}
          strokeWidth={1.6}
        />
        <Circle cx="12" cy="12" r="2.4" stroke={color} strokeWidth={1.6} />
      </Svg>
    );
  }

  return (
    <Svg {...commonProps} style={getDirectionalIconStyle(isRTL)}>
      <Polyline
        points="9 5 16 12 9 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
