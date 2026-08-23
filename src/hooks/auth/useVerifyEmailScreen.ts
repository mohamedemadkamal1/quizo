import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/hooks/useTranslation';
import { verifyPasswordResetCode } from '@/services/auth.service';
import { usePasswordResetStore } from '@/store/password-reset.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useVerifyEmailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const email = usePasswordResetStore((state) => state.email);
  const markVerified = usePasswordResetStore((state) => state.markVerified);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email) {
      router.replace('/forgot-password');
    }
  }, [email, router]);

  async function verify() {
    if (!email || code.length !== 6) {
      setError(t('auth.verifyEmail.incompleteCode'));
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const resetToken = await verifyPasswordResetCode({ email, code });
      markVerified(resetToken);
      router.push('/new-password');
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, t('auth.errors.verifyCodeFailed')),
      );
    } finally {
      setIsVerifying(false);
    }
  }

  return {
    canRender: Boolean(email),
    code,
    error,
    isVerifying,
    onCodeChange: (nextCode: string) => {
      setCode(nextCode);
      setError(null);
    },
    onVerify: () => {
      void verify();
    },
  };
}
