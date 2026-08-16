import { ProfileProgressContent } from '@/components/profile/ProfileProgressContent';
import { useProfileProgressScreen } from '@/hooks/profile/useProfileProgressScreen';

export function ProfileProgressScreen() {
  const screen = useProfileProgressScreen();

  return <ProfileProgressContent screen={screen} />;
}
