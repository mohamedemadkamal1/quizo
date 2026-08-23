import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AuthFormError } from '@/components/auth/AuthFormError';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthLink, AuthPromptLink } from '@/components/auth/AuthLink';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import type { useSignInScreen } from '@/hooks/auth/useSignInScreen';

type SignInFormProps = {
  screen: ReturnType<typeof useSignInScreen>;
};

export function SignInForm({ screen }: SignInFormProps) {
  const { t } = useTranslation();

  return (
    <AuthScreenLayout
      title={t('auth.signIn.title')}
      subtitle={t('auth.signIn.subtitle')}
      footer={
        <AuthPromptLink
          prefix={t('auth.signIn.promptPrefix')}
          action={t('auth.signIn.promptAction')}
          disabled={screen.isSubmitting}
          onPress={screen.onSignUp}
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
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              editable={!screen.isSubmitting}
              onSubmitEditing={screen.onSubmit}
            />
          )}
        />

        <View className="items-end">
          <AuthLink
            label={t('auth.signIn.forgotPassword')}
            onPress={screen.onForgotPassword}
          />
        </View>

        {screen.resetSucceeded ? (
          <AppText className="text-center font-nunito text-xs font-medium leading-4 text-green-600">
            {t('auth.signIn.resetSuccess')}
          </AppText>
        ) : null}

        <AuthFormError message={screen.errors.root?.message} />
      </View>

      <AppButton
        label={t('auth.signIn.submit')}
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
