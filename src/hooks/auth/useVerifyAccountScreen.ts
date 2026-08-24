import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/hooks/useTranslation';
import { useAccountVerificationStore } from '@/store/account-verification.store';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useVerifyAccountScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const email = useAccountVerificationStore((state) => state.email);
  const verifyAccount = useAuthStore((state) => state.verifyAccount);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email) {
      router.replace('/sign-up');
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
      // Storing the session is the whole navigation: the guard in the root
      // layout swaps the auth group for the tabs as soon as it lands. That is
      // also why nothing is reset on success — the pending email would send
      // this screen back to sign-up on its way out, and the button should stay
      // busy rather than flash back to idle during the transition.
      await verifyAccount({ email, code });
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, t('auth.errors.verifyCodeFailed')),
      );
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
