import { Text } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';

import { router } from 'expo-router';

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

export default function WelcomeScreen() {
  function handleContinueWithEmail() {
    router.push('/sign-in');
  }

  return (
    <AuthScreenLayout
      title="Welcome to Quizo !"
      subtitle="Your fun journey to learn, play, and grow starts here."
      footer={<LegalNotice />}
    >
      <AppButton
        label="Continue with Email"
        onPress={handleContinueWithEmail}
      />

      <AppButton
        label="Continue as a Guest"
        variant="secondary"
        onPress={() => {
          router.push('/guest-profile');
        }}
      />
    </AuthScreenLayout>
  );
}
