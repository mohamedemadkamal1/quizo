import { LevelCompleteContent } from '@/components/level-complete/LevelCompleteContent';
import { useLevelCompleteScreen } from '@/hooks/level-complete/useLevelCompleteScreen';

export function LevelCompleteScreen() {
  const screen = useLevelCompleteScreen();

  return <LevelCompleteContent screen={screen} />;
}
