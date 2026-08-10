import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import {
  type SignInFormValues,
  signInSchema,
} from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useSignInScreen() {
  const router = useRouter();
  const { reset } = useLocalSearchParams<{ reset?: string }>();
  const signIn = useAuthStore((state) => state.signIn);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function submit(values: SignInFormValues) {
    try {
      await signIn(values);
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to sign in. Please try again.',
        ),
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
