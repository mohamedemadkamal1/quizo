import Svg, { Path } from 'react-native-svg';

import type { NavigationIconProps } from './types';

export function HomeTabIcon({
  color,
  focused = false,
  width = 24,
  height = 24,
}: NavigationIconProps) {
  if (!focused) {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Path
          d="M12 17.99V14.99"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 21 20" fill="none">
      <Path
        d="M18.05 4.81774L12.29 0.78774C10.72 -0.31226 8.31 -0.252259 6.8 0.917741L1.79 4.82774C0.79 5.60774 0 7.20774 0 8.46774V15.3677C0 17.9177 2.07 19.9977 4.62 19.9977H15.4C17.95 19.9977 20.02 17.9277 20.02 15.3777V8.59774C20.02 7.24774 19.15 5.58774 18.05 4.81774ZM10.76 15.9977C10.76 16.4077 10.42 16.7477 10.01 16.7477C9.6 16.7477 9.26 16.4077 9.26 15.9977V12.9977C9.26 12.5877 9.6 12.2477 10.01 12.2477C10.42 12.2477 10.76 12.5877 10.76 12.9977V15.9977Z"
        fill={color}
      />
    </Svg>
  );
}
