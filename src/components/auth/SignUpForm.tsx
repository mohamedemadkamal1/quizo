import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthFormError } from '@/components/auth/AuthFormError';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthPromptLink } from '@/components/auth/AuthLink';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import type { useSignUpScreen } from '@/hooks/auth/useSignUpScreen';

type SignUpFormProps = {
  screen: ReturnType<typeof useSignUpScreen>;
};

export function SignUpForm({ screen }: SignUpFormProps) {
  const { t } = useTranslation();

  return (
    <AuthScreenLayout
      title={t('auth.signUp.title')}
      subtitle={t('auth.signUp.subtitle')}
      footer={
        <AuthPromptLink
          prefix={t('auth.signUp.promptPrefix')}
          action={t('auth.signUp.promptAction')}
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
              returnKeyType="next"
              ltrContent
              editable={!screen.isSubmitting}
            />
          )}
        />

        <Controller
          control={screen.control}
          name="password"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={screen.errors.password?.message}
              placeholder={t('auth.fields.password')}
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
        label={t('auth.signUp.submit')}
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
