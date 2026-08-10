import { WelcomeContent } from '@/components/auth/WelcomeContent';
import { useWelcomeScreen } from '@/hooks/auth/useWelcomeScreen';

export function WelcomeScreen() {
  const screen = useWelcomeScreen();

  return <WelcomeContent screen={screen} />;
}
