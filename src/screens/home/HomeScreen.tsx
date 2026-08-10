import { HomeContent } from '@/components/home/HomeContent';
import { useHomeScreen } from '@/hooks/home/useHomeScreen';

export function HomeScreen() {
  const screen = useHomeScreen();

  return <HomeContent screen={screen} />;
}
