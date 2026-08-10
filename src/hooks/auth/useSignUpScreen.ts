import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import {
  type SignUpFormValues,
  signUpSchema,
} from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useSignUpScreen() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
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
              error.response.data?.message ??
              'This email is already registered.',
          },
          { shouldFocus: true },
        );
        return;
      }

      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to create your account. Please try again.',
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
