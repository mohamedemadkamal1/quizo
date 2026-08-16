import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type LevelPathProps = {
  width: number;
  height: number;
  nodeX: number;
  previousNodeX: number | null;
  nextNodeX: number | null;
  previousColor: string;
  nextColor: string;
};

function createPath(fromX: number, fromY: number, toX: number, toY: number) {
  const middleY = (fromY + toY) / 2;
  return `M ${fromX} ${fromY} C ${fromX} ${middleY}, ${toX} ${middleY}, ${toX} ${toY}`;
}

export function LevelPath({
  width,
  height,
  nodeX,
  previousNodeX,
  nextNodeX,
  previousColor,
  nextColor,
}: LevelPathProps) {
  const centerY = height / 2;

  return (
    <Svg
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      width={width}
      height={height}
      style={[StyleSheet.absoluteFill, styles.path]}
    >
      {previousNodeX === null ? null : (
        <Path
          d={createPath((previousNodeX + nodeX) / 2, 0, nodeX, centerY)}
          fill="none"
          stroke={previousColor}
          strokeDasharray="2 13"
          strokeLinecap="round"
          strokeWidth={8}
        />
      )}

      {nextNodeX === null ? null : (
        <Path
          d={createPath(nodeX, centerY, (nodeX + nextNodeX) / 2, height)}
          fill="none"
          stroke={nextColor}
          strokeDasharray="2 13"
          strokeLinecap="round"
          strokeWidth={8}
        />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  path: {
    zIndex: 0,
  },
});
