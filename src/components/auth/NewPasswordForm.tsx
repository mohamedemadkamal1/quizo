import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import type { useNewPasswordScreen } from '@/hooks/auth/useNewPasswordScreen';

type NewPasswordFormProps = {
  screen: ReturnType<typeof useNewPasswordScreen>;
};

export function NewPasswordForm({ screen }: NewPasswordFormProps) {

  if (!screen.canRender) {
    return null;
  }

  return (
    <AuthScreenLayout
      title="Create New Password"
      subtitle="Create a new password to secure your account."
    >
      <View className="w-[280px] max-w-full gap-4">
        <Controller
          control={screen.control}
          name="password"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={screen.errors.password?.message}
              placeholder="New Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              editable={!screen.isSubmitting}
            />
          )}
        />

        <Controller
          control={screen.control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={screen.errors.confirmPassword?.message}
              placeholder="Confirm Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
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
        label="Reset Password"
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
