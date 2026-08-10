import { GuestProfileForm } from '@/components/auth/GuestProfileForm';
import { useGuestProfileScreen } from '@/hooks/auth/useGuestProfileScreen';

export function GuestProfileScreen() {
  const screen = useGuestProfileScreen();

  return <GuestProfileForm screen={screen} />;
}
