import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthInput } from '@/components/atoms/AuthInput';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';
import { resetPassword } from '@/features/auth/services/auth.service';
import { usePasswordResetStore } from '@/features/auth/stores/password-reset.store';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import {
  NewPasswordFormValues,
  newPasswordSchema,
} from '../../features/auth/validation/auth.schemas';

export default function NewPasswordScreen() {
  const resetToken = usePasswordResetStore((state) => state.resetToken);

  const clearResetFlow = usePasswordResetStore((state) => state.clear);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!resetToken) {
      router.replace('/forgot-password');
    }
  }, [resetToken]);

  if (!resetToken) {
    return null;
  }

  const verifiedResetToken = resetToken;

  async function handleResetPassword(values: NewPasswordFormValues) {
    try {
      await resetPassword({
        resetToken: verifiedResetToken,
        newPassword: values.password,
      });

      clearResetFlow();

      router.replace({
        pathname: '/sign-in',
        params: {
          reset: 'success',
        },
      });
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, 'Unable to reset your password.'),
      });
    }
  }

  return (
    <AuthScreenLayout
      title="Create New Password"
      subtitle="Create a new password to secure your account."
    >
      <View className="w-[280px] max-w-full gap-4">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
              placeholder="New Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
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
              onSubmitEditing={() => {
                void handleSubmit(handleResetPassword)();
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
        label="Reset Password"
        isLoading={isSubmitting}
        onPress={() => {
          void handleSubmit(handleResetPassword)();
        }}
      />
    </AuthScreenLayout>
  );
}
