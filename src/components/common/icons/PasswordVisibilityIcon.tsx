import Svg, { Circle, Line, Path } from 'react-native-svg';

type PasswordVisibilityIconProps = {
  visible: boolean;
  color: string;
  size?: number;
};

export function PasswordVisibilityIcon({
  visible,
  color,
  size = 24,
}: PasswordVisibilityIconProps) {
  if (!visible) {
    return (
      <Svg
        accessibilityElementsHidden
        fill="none"
        height={size}
        importantForAccessibility="no-hide-descendants"
        viewBox="0 0 24 24"
        width={size}
      >
        <Path
          d="M4 11.5c1.5 2.7 4.2 4.3 8 4.3s6.5-1.6 8-4.3"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.8}
        />
        <Line x1="6.7" x2="5.6" y1="14.2" y2="17" stroke={color} strokeLinecap="round" strokeWidth={1.8} />
        <Line x1="11.9" x2="11.9" y1="15.8" y2="19" stroke={color} strokeLinecap="round" strokeWidth={1.8} />
        <Line x1="17.2" x2="18.4" y1="14.2" y2="17" stroke={color} strokeLinecap="round" strokeWidth={1.8} />
      </Svg>
    );
  }

  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      viewBox="0 0 24 24"
      width={size}
    >
      <Path
        d="M3 12s3.3-5 9-5 9 5 9 5-3.3 5-9 5-9-5-9-5Z"
        stroke={color}
        strokeWidth={1.7}
      />
      <Circle cx="12" cy="12" r="2.4" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}
