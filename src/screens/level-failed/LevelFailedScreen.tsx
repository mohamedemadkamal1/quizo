import { LevelFailedContent } from "@/components/level-failed/LevelFailedContent";
import { useLevelFailedScreen } from "@/hooks/level-failed/useLevelFailedScreen";

export function LevelFailedScreen() {
  const screen = useLevelFailedScreen();

  return <LevelFailedContent screen={screen} />;
}
