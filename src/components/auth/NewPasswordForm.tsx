import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthFormError } from '@/components/auth/AuthFormError';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import type { useNewPasswordScreen } from '@/hooks/auth/useNewPasswordScreen';

type NewPasswordFormProps = {
  screen: ReturnType<typeof useNewPasswordScreen>;
};

export function NewPasswordForm({ screen }: NewPasswordFormProps) {
  const { t } = useTranslation();

  if (!screen.canRender) {
    return null;
  }

  return (
    <AuthScreenLayout
      title={t('auth.newPassword.title')}
      subtitle={t('auth.newPassword.subtitle')}
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
              placeholder={t('auth.fields.newPassword')}
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
              placeholder={t('auth.fields.confirmPassword')}
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

        <AuthFormError message={screen.errors.root?.message} />
      </View>

      <AppButton
        label={t('auth.newPassword.submit')}
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
