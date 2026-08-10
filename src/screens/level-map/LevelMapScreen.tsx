import { LevelMapContent } from '@/components/level-map/LevelMapContent';
import { useLevelMapScreen } from '@/hooks/level-map/useLevelMapScreen';

export function LevelMapScreen() {
  const screen = useLevelMapScreen();

  return <LevelMapContent screen={screen} />;
}

