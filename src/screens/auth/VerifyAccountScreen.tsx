import { VerifyAccountForm } from '@/components/auth/VerifyAccountForm';
import { useVerifyAccountScreen } from '@/hooks/auth/useVerifyAccountScreen';

export function VerifyAccountScreen() {
  const screen = useVerifyAccountScreen();

  return <VerifyAccountForm screen={screen} />;
}
