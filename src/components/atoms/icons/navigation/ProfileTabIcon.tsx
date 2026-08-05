import Svg, { Path } from 'react-native-svg';

import type { NavigationIconProps } from './types';

export function ProfileTabIcon({
  color,
  focused = false,
  width = 25,
  height = 25,
}: NavigationIconProps) {
  if (focused) {
    return (
      <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
        <Path
          d="M12.5053 12.2175C14.7549 12.2175 16.6905 10.2086 16.6905 7.59278C16.6905 5.00836 14.7444 3.09363 12.5053 3.09363C10.2662 3.09363 8.32 5.05024 8.32 7.61372C8.32 10.2086 10.2662 12.2175 12.5053 12.2175ZM5.93442 21.9064H19.0762C20.7188 21.9064 21.3048 21.4355 21.3048 20.5148C21.3048 17.8153 17.9252 14.0904 12.5053 14.0904C7.07491 14.0904 3.69531 17.8153 3.69531 20.5148C3.69531 21.4355 4.28121 21.9064 5.93442 21.9064Z"
          fill={color}
        />
      </Svg>
    );
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
