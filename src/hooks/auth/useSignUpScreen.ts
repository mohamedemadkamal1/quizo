import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from '@/hooks/useTranslation';
import {
  createSignUpSchema,
  type SignUpFormValues,
} from '@/schemas/auth.schemas';
import { signUp } from '@/services/auth.service';
import { useAccountVerificationStore } from '@/store/account-verification.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useSignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const beginVerification = useAccountVerificationStore(
    (state) => state.begin,
  );
  const schema = useMemo(() => createSignUpSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function submit(values: SignUpFormValues) {
    const email = values.email.trim().toLowerCase();

    try {
      await signUp({
        signupType: 'ACCOUNT',
        email,
        password: values.password,
      });

      beginVerification(email);
      router.push('/verify-account');
    } catch (error) {
      if (
        isAxiosError<{ message?: string }>(error) &&
        error.response?.status === 409
      ) {
        setError(
          'email',
          {
            type: 'server',
            message:
              error.response.data?.message ?? t('auth.errors.emailTaken'),
          },
          { shouldFocus: true },
        );
        return;
      }

      setError('root', {
        message: getApiErrorMessage(error, t('auth.errors.signUpFailed')),
      });
    }
  }

  return {
    control,
    errors,
    isSubmitting,
    onSubmit: () => {
      void handleSubmit(submit)();
    },
    onSignIn: () => {
      router.replace('/sign-in');
    },
  };
}
