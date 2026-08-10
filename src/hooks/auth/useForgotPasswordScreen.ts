import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/schemas/auth.schemas';
import { requestPasswordReset } from '@/services/auth.service';
import { usePasswordResetStore } from '@/store/password-reset.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useForgotPasswordScreen() {
  const router = useRouter();
  const beginReset = usePasswordResetStore((state) => state.begin);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function submit(values: ForgotPasswordFormValues) {
    try {
      await requestPasswordReset({ email: values.email });
      beginReset(values.email);
      router.push('/verify-email');
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, 'Unable to send the reset code.'),
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
