import { SignUpForm } from '@/components/auth/SignUpForm';
import { useSignUpScreen } from '@/hooks/auth/useSignUpScreen';

export function SignUpScreen() {
  const screen = useSignUpScreen();

  return <SignUpForm screen={screen} />;
}
