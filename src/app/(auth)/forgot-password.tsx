import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthInput } from '@/components/atoms/AuthInput';
import { AuthPromptLink } from '@/components/atoms/AuthLink';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';
import { requestPasswordReset } from '@/features/services/auth.service';
import { usePasswordResetStore } from '@/features/stores/password-reset.store';
import { getApiErrorMessage } from '@/features/utils/get-api-error-message';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '../../features/validation/auth.schemas';

export default function ForgotPasswordScreen() {
  const beginReset = usePasswordResetStore((state) => state.begin);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function handleSend(values: ForgotPasswordFormValues) {
    try {
      await requestPasswordReset({
        email: values.email,
      });

      beginReset(values.email);
      router.push('/verify-email');
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, 'Unable to send the reset code.'),
      });
    }
  }

  return (
    <AuthScreenLayout
      title="Forgot Password?"
      subtitle="Enter your email to reset your password."
      footer={
        <AuthPromptLink
          prefix="Back to"
          action="Sign In"
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
              returnKeyType="send"
              onSubmitEditing={() => {
                void handleSubmit(handleSend)();
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
        label="Send"
        isLoading={isSubmitting}
        onPress={() => {
          void handleSubmit(handleSend)();
        }}
      />
    </AuthScreenLayout>
  );
}
