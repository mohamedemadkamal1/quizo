import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from '@/hooks/useTranslation';
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/schemas/auth.schemas';
import { requestPasswordReset } from '@/services/auth.service';
import { usePasswordResetStore } from '@/store/password-reset.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const beginReset = usePasswordResetStore((state) => state.begin);
  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  async function submit(values: ForgotPasswordFormValues) {
    try {
      await requestPasswordReset({ email: values.email });
      beginReset(values.email);
      router.push('/verify-email');
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          t('auth.errors.sendResetCodeFailed'),
        ),
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
