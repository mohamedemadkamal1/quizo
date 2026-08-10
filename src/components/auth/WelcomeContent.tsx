import { Text } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import type { useWelcomeScreen } from '@/hooks/auth/useWelcomeScreen';

function LegalNotice() {
  return (
    <Text className="text-center font-nunito text-xs font-medium leading-4 text-slate-500">
      By continuing, you agree to our{' '}
      <Text className="text-muv-blue-300 underline">Terms</Text>
      {' & '}
      <Text className="text-muv-blue-300 underline">Privacy Policy</Text>.
    </Text>
  );
}

type WelcomeContentProps = {
  screen: ReturnType<typeof useWelcomeScreen>;
};

export function WelcomeContent({ screen }: WelcomeContentProps) {

  return (
    <AuthScreenLayout
      title="Welcome to Quizo !"
      subtitle="Your fun journey to learn, play, and grow starts here."
      footer={<LegalNotice />}
    >
      <AppButton
        label="Continue with Email"
        onPress={screen.onContinueWithEmail}
      />

      <AppButton
        label="Continue as a Guest"
        variant="secondary"
        onPress={screen.onContinueAsGuest}
      />
    </AuthScreenLayout>
  );
}
