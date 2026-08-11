import { QuestionsContent } from '@/components/questions/QuestionsContent';
import { useQuestionsScreen } from '@/hooks/questions/useQuestionsScreen';

export function QuestionsScreen() {
  const screen = useQuestionsScreen();

  return <QuestionsContent screen={screen} />;
}
