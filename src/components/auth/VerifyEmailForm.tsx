import { Text } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { OtpInput } from '@/components/auth/OtpInput';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import type { useVerifyEmailScreen } from '@/hooks/auth/useVerifyEmailScreen';

type VerifyEmailFormProps = {
  screen: ReturnType<typeof useVerifyEmailScreen>;
};

export function VerifyEmailForm({ screen }: VerifyEmailFormProps) {

  if (!screen.canRender) {
    return null;
  }

  return (
    <AuthScreenLayout
      title="Verify Your Email"
      subtitle="Enter the 6-digit code sent to your email."
    >
      <OtpInput
        value={screen.code}
        onChange={screen.onCodeChange}
        autoFocus
        editable={!screen.isVerifying}
      />

      {screen.error ? (
        <Text className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
          {screen.error}
        </Text>
      ) : null}

      <AppButton
        label="Verify"
        disabled={screen.code.length !== 6}
        isLoading={screen.isVerifying}
        onPress={screen.onVerify}
      />
    </AuthScreenLayout>
  );
}
