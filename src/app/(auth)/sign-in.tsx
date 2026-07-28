import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthInput } from '@/components/atoms/AuthInput';
import { AuthLink, AuthPromptLink } from '@/components/atoms/AuthLink';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';
import { getApiErrorMessage } from '@/features/utils/get-api-error-message';
import { useAuthStore } from '../../features/stores/auth.store';
import {
  SignInFormValues,
  signInSchema,
} from '../../features/validation/auth.schemas';

export default function SignInScreen() {
  const { reset } = useLocalSearchParams<{
    reset?: string;
  }>();

  const signIn = useAuthStore((state) => state.signIn);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleSignIn(values: SignInFormValues) {
    try {
      await signIn(values);
      router.replace('/home');
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to sign in. Please try again.',
        ),
      });
    }
  }

  return (
    <AuthScreenLayout
      title="Welcome Back!"
      subtitle="Sign in to continue your learning journey."
      footer={
        <AuthPromptLink
          prefix="Don’t have an account?"
          action="Sign Up"
          onPress={() => {
            // Connect to /sign-up after its design is provided.
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
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={() => {
                void handleSubmit(handleSignIn)();
              }}
            />
          )}
        />

        <View className="items-end">
          <AuthLink
            label="Forgot Password?"
            onPress={() => {
              router.push('/forgot-password');
            }}
          />
        </View>

        {reset === 'success' ? (
          <Text className="text-center font-nunito text-xs font-medium leading-4 text-green-600">
            Your password was reset successfully.
          </Text>
        ) : null}

        {errors.root?.message ? (
          <Text className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
            {errors.root.message}
          </Text>
        ) : null}
      </View>

      <AppButton
        label="Sign In"
        isLoading={isSubmitting}
        onPress={() => {
          void handleSubmit(handleSignIn)();
        }}
      />
    </AuthScreenLayout>
  );
}
