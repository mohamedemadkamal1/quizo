import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import type { useGuestProfileScreen } from '@/hooks/auth/useGuestProfileScreen';

type GuestProfileFormProps = {
  screen: ReturnType<typeof useGuestProfileScreen>;
};

export function GuestProfileForm({ screen }: GuestProfileFormProps) {
  const { t } = useTranslation();

  return (
    <AuthScreenLayout
      title={t('auth.guestProfile.title')}
      subtitle={t('auth.guestProfile.subtitle')}
    >
      <View className="w-[280px] max-w-full gap-4">
        <Controller
          control={screen.control}
          name="nickname"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={screen.errors.nickname?.message}
              placeholder={t('auth.fields.nickname')}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="off"
              maxLength={24}
              returnKeyType="next"
              editable={!screen.isSubmitting}
            />
          )}
        />

        <Controller
          control={screen.control}
          name="age"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={screen.onAgeChange}
              onBlur={field.onBlur}
              error={screen.errors.age?.message}
              placeholder={t('auth.fields.age')}
              keyboardType="number-pad"
              maxLength={3}
              returnKeyType="done"
              ltrContent
              editable={!screen.isSubmitting}
              onSubmitEditing={screen.onSubmit}
            />
          )}
        />

        {screen.errors.root?.message ? (
          <AppText className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
            {screen.errors.root.message}
          </AppText>
        ) : null}
      </View>

      <AppButton
        label={t('auth.guestProfile.submit')}
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
