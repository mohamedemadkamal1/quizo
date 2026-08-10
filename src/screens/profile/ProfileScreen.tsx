import { ProfileContent } from '@/components/profile/ProfileContent';
import { useProfileScreen } from '@/hooks/profile/useProfileScreen';

export function ProfileScreen() {
  const screen = useProfileScreen();

  return <ProfileContent screen={screen} />;
}
