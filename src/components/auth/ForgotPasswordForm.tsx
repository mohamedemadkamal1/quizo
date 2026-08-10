import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthPromptLink } from '@/components/auth/AuthLink';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import type { useForgotPasswordScreen } from '@/hooks/auth/useForgotPasswordScreen';

type ForgotPasswordFormProps = {
  screen: ReturnType<typeof useForgotPasswordScreen>;
};

export function ForgotPasswordForm({ screen }: ForgotPasswordFormProps) {

  return (
    <AuthScreenLayout
      title="Forgot Password?"
      subtitle="Enter your email to reset your password."
      footer={
        <AuthPromptLink
          prefix="Back to"
          action="Sign In"
          disabled={screen.isSubmitting}
          onPress={screen.onSignIn}
        />
      }
    >
      <View className="w-[280px] max-w-full gap-4">
        <Controller
          control={screen.control}
          name="email"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={screen.errors.email?.message}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              editable={!screen.isSubmitting}
              onSubmitEditing={screen.onSubmit}
            />
          )}
        />

        {screen.errors.root?.message ? (
          <Text className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
            {screen.errors.root.message}
          </Text>
        ) : null}
      </View>

      <AppButton
        label="Send"
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
