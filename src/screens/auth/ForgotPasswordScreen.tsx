import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useForgotPasswordScreen } from '@/hooks/auth/useForgotPasswordScreen';

export function ForgotPasswordScreen() {
  const screen = useForgotPasswordScreen();

  return <ForgotPasswordForm screen={screen} />;
}
