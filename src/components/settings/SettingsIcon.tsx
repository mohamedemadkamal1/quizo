import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

type SettingsIconName = 'chevron' | 'edit' | 'lock' | 'logout' | 'trash';

type SettingsIconProps = {
  name: SettingsIconName;
  color: string;
  size?: number;
};

export function SettingsIcon({ name, color, size = 22 }: SettingsIconProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
  } as const;

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
    return (
      <Svg {...commonProps}>
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

  return (
    <Svg {...commonProps}>
      <Polyline
        points="9 5 16 12 9 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="16"
        y1="12"
        x2="15.9"
        y2="12"
        stroke={color}
        strokeWidth={1.8}
      />
    </Svg>
  );
}
