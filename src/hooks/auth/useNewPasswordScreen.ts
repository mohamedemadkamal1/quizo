import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRouter } from 'expo-router';
import { CommonActions } from 'expo-router/react-navigation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from '@/hooks/useTranslation';
import {
  createNewPasswordSchema,
  type NewPasswordFormValues,
} from '@/schemas/auth.schemas';
import { resetPassword } from '@/services/auth.service';
import { usePasswordResetStore } from '@/store/password-reset.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useNewPasswordScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const resetToken = usePasswordResetStore((state) => state.resetToken);
  const clearResetFlow = usePasswordResetStore((state) => state.clear);
  const schema = useMemo(() => createNewPasswordSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!resetToken) {
      router.replace('/forgot-password');
    }
  }, [resetToken, router]);

  async function submit(values: NewPasswordFormValues) {
    if (!resetToken) {
      return;
    }

    try {
      await resetPassword({ resetToken, password: values.password });
      clearResetFlow();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'sign-in',
              params: { reset: 'success' },
            },
          ],
        }),
      );
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          t('auth.errors.resetPasswordFailed'),
        ),
      });
    }
  }

  return {
    canRender: Boolean(resetToken),
    control,
    errors,
    isSubmitting,
    onSubmit: () => {
      void handleSubmit(submit)();
    },
  };
}
