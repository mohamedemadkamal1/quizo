import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthLink, AuthPromptLink } from '@/components/auth/AuthLink';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import type { useSignInScreen } from '@/hooks/auth/useSignInScreen';

type SignInFormProps = {
  screen: ReturnType<typeof useSignInScreen>;
};

export function SignInForm({ screen }: SignInFormProps) {

  return (
    <AuthScreenLayout
      title="Welcome Back!"
      subtitle="Sign in to continue your learning journey."
      footer={
        <AuthPromptLink
          prefix="Don’t have an account?"
          action="Sign Up"
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
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
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
              placeholder="Password"
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
            label="Forgot Password?"
            onPress={screen.onForgotPassword}
          />
        </View>

        {screen.resetSucceeded ? (
          <Text className="text-center font-nunito text-xs font-medium leading-4 text-green-600">
            Your password was reset successfully.
          </Text>
        ) : null}

        {screen.errors.root?.message ? (
          <Text className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
            {screen.errors.root.message}
          </Text>
        ) : null}
      </View>

      <AppButton
        label="Sign In"
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
