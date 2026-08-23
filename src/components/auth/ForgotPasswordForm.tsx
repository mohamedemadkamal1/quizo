import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthFormError } from '@/components/auth/AuthFormError';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthPromptLink } from '@/components/auth/AuthLink';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import type { useForgotPasswordScreen } from '@/hooks/auth/useForgotPasswordScreen';

type ForgotPasswordFormProps = {
  screen: ReturnType<typeof useForgotPasswordScreen>;
};

export function ForgotPasswordForm({ screen }: ForgotPasswordFormProps) {
  const { t } = useTranslation();

  return (
    <AuthScreenLayout
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
      footer={
        <AuthPromptLink
          prefix={t('auth.forgotPassword.promptPrefix')}
          action={t('auth.forgotPassword.promptAction')}
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
              placeholder={t('auth.fields.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              ltrContent
              editable={!screen.isSubmitting}
              onSubmitEditing={screen.onSubmit}
            />
          )}
        />

        <AuthFormError message={screen.errors.root?.message} />
      </View>

      <AppButton
        label={t('auth.forgotPassword.submit')}
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
