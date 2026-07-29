import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthPromptLink } from '@/components/atoms/AuthLink';
import { OtpInput } from '@/components/atoms/OtpInput';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';
import {
  resendPasswordResetCode,
  verifyPasswordResetCode,
} from '../../features/auth/services/auth.service';

import { usePasswordResetStore } from '@/features/auth/stores/password-reset.store';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';

export default function VerifyEmailScreen() {
  const email = usePasswordResetStore((state) => state.email);

  const markVerified = usePasswordResetStore((state) => state.markVerified);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      router.replace('/forgot-password');
    }
  }, [email]);

  if (!email) {
    return null;
  }

  const verifiedEmail = email;

  async function handleVerify() {
    if (code.length !== 6) {
      setError('Enter the complete 6-digit code.');
      return;
    }

    setError(null);
    setMessage(null);
    setIsVerifying(true);

    try {
      const resetToken = await verifyPasswordResetCode({
        email: verifiedEmail,
        code,
      });

      markVerified(resetToken);
      router.push('/new-password');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to verify the code.'));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);
    setIsResending(true);

    try {
      await resendPasswordResetCode({ email: verifiedEmail });
      setCode('');
      setMessage('A new verification code was sent.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to resend the code.'));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthScreenLayout
      title="Verify Your Email"
      subtitle="Enter the 6-digit code sent to your email."
      footer={
        <AuthPromptLink
          prefix="Didn’t receive a code?"
          action={isResending ? 'Sending...' : 'Resend'}
          disabled={isResending}
          onPress={() => {
            void handleResend();
          }}
        />
      }
    >
      <OtpInput
        value={code}
        onChange={(nextCode) => {
          setCode(nextCode);
          setError(null);
        }}
        autoFocus
      />

      {message ? (
        <Text className="text-center font-nunito text-xs font-medium leading-4 text-green-600">
          {message}
        </Text>
      ) : null}

      {error ? (
        <Text className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
          {error}
        </Text>
      ) : null}

      <AppButton
        label="Verify"
        disabled={code.length !== 6}
        isLoading={isVerifying}
        onPress={() => {
          void handleVerify();
        }}
      />
    </AuthScreenLayout>
  );
}
