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
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useSignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const signUp = useAuthStore((state) => state.signUp);
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
    try {
      await signUp({
        signupType: 'ACCOUNT',
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
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
