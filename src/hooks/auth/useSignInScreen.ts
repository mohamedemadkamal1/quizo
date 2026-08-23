import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from '@/hooks/useTranslation';
import {
  createSignInSchema,
  type SignInFormValues,
} from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useSignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { reset } = useLocalSearchParams<{ reset?: string }>();
  const signIn = useAuthStore((state) => state.signIn);
  const schema = useMemo(() => createSignInSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function submit(values: SignInFormValues) {
    try {
      await signIn(values);
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, t('auth.errors.signInFailed')),
      });
    }
  }

  return {
    control,
    errors,
    isSubmitting,
    resetSucceeded: reset === 'success',
    onSubmit: () => {
      void handleSubmit(submit)();
    },
    onSignUp: () => {
      router.push('/sign-up');
    },
    onForgotPassword: () => {
      router.push('/forgot-password');
    },
  };
}
