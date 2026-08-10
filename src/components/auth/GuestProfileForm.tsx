import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import type { useGuestProfileScreen } from '@/hooks/auth/useGuestProfileScreen';

type GuestProfileFormProps = {
  screen: ReturnType<typeof useGuestProfileScreen>;
};

export function GuestProfileForm({ screen }: GuestProfileFormProps) {

  return (
    <AuthScreenLayout
      title="Let's Get to Know You!"
      subtitle="Choose a nickname and enter your age to start playing."
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
              placeholder="Nickname"
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
              placeholder="Age"
              keyboardType="number-pad"
              maxLength={3}
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
        label="Start Learning!"
        isLoading={screen.isSubmitting}
        onPress={screen.onSubmit}
      />
    </AuthScreenLayout>
  );
}
