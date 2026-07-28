import { Text } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';

import { router } from 'expo-router';
import { useState } from 'react';

import { useAuthStore } from '@/features/stores/auth.store';
import { getApiErrorMessage } from '@/features/utils/get-api-error-message';

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
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);

  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  function handleContinueWithEmail() {
    router.push('/sign-in');
  }

  async function handleContinueAsGuest() {
    setGuestError(null);
    setIsCreatingGuest(true);

    try {
      await continueAsGuest();
      router.replace('/home');
    } catch (error) {
      setGuestError(
        getApiErrorMessage(error, 'Unable to continue as a guest.'),
      );
    } finally {
      setIsCreatingGuest(false);
    }
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
        isLoading={isCreatingGuest}
        onPress={() => {
          void handleContinueAsGuest();
        }}
      />
    </AuthScreenLayout>
  );
}
