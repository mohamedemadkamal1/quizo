import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthInput } from '@/components/atoms/AuthInput';
import { AuthPromptLink } from '@/components/atoms/AuthLink';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import {
  SignUpFormValues,
  signUpSchema,
} from '@/features/auth/validation/auth.schemas';

export default function SignUpScreen() {
  const signUp = useAuthStore((state) => state.signUp);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function handleSignUp(values: SignUpFormValues) {
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
          {
            shouldFocus: true,
          },
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

  return (
    <AuthScreenLayout
      title="Create Your Account"
      subtitle="Start your journey to learn, play, and grow with Quizo"
      footer={
        <AuthPromptLink
          prefix="Already have an account?"
          action="Sign In"
          disabled={isSubmitting}
          onPress={() => {
            router.replace('/sign-in');
          }}
        />
      }
    >
      <View className="w-[280px] max-w-full gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              editable={!isSubmitting}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              editable={!isSubmitting}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.confirmPassword?.message}
              placeholder="Confirm Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={() => {
                void handleSubmit(handleSignUp)();
              }}
            />
          )}
        />

        {errors.root?.message ? (
          <Text className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
            {errors.root.message}
          </Text>
        ) : null}
      </View>

      <AppButton
        label="Sign Up"
        isLoading={isSubmitting}
        onPress={() => {
          void handleSubmit(handleSignUp)();
        }}
      />
    </AuthScreenLayout>
  );
}
