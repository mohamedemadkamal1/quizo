import { SignInForm } from '@/components/auth/SignInForm';
import { useSignInScreen } from '@/hooks/auth/useSignInScreen';

export function SignInScreen() {
  const screen = useSignInScreen();

  return <SignInForm screen={screen} />;
}
