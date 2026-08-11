import Svg, { Path } from 'react-native-svg';

export function CompletionStar({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      <Path
        d="m24 2.7 6.3 12.8 14.1 2-10.2 10 2.4 14L24 34.9l-12.6 6.6 2.4-14-10.2-10 14.1-2L24 2.7Z"
        fill={color}
      />
    </Svg>
  );
}

export function CompletionChevron({ size }: { size: number }) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        d="m9 5 7 7-7 7"
        fill="none"
        stroke="#485BDD"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </Svg>
  );
}
