import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';
import { useVerifyEmailScreen } from '@/hooks/auth/useVerifyEmailScreen';

export function VerifyEmailScreen() {
  const screen = useVerifyEmailScreen();

  return <VerifyEmailForm screen={screen} />;
}
