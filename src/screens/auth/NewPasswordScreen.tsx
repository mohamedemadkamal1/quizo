import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { useNewPasswordScreen } from '@/hooks/auth/useNewPasswordScreen';

export function NewPasswordScreen() {
  const screen = useNewPasswordScreen();

  return <NewPasswordForm screen={screen} />;
}
