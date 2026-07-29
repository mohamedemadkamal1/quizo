import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AuthInput } from '@/components/atoms/AuthInput';
import { AuthScreenLayout } from '@/components/templates/AuthScreenLayout';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import {
  GuestProfileFormValues,
  guestProfileSchema,
} from '@/features/auth/validation/auth.schemas';

export default function GuestProfileScreen() {
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GuestProfileFormValues>({
    resolver: zodResolver(guestProfileSchema),
    defaultValues: {
      nickname: '',
      age: '',
    },
  });

  async function handleStartLearning(values: GuestProfileFormValues) {
    try {
      await continueAsGuest({
        nickname: values.nickname.trim() || null,
        age: values.age ? Number(values.age) : null,
      });

      router.replace('/home');
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to start the guest session.',
        ),
      });
    }
  }

  return (
    <AuthScreenLayout
      title="Let's Get to Know You!"
      subtitle="Choose a nickname and enter your age, or skip for now."
    >
      <View className="w-[280px] max-w-full gap-4">
        <Controller
          control={control}
          name="nickname"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.nickname?.message}
              placeholder="Nickname"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="off"
              maxLength={24}
              returnKeyType="next"
              editable={!isSubmitting}
            />
          )}
        />

        <Controller
          control={control}
          name="age"
          render={({ field }) => (
            <AuthInput
              value={field.value}
              onChangeText={(value) => {
                field.onChange(value.replace(/\D/g, '').slice(0, 3));
              }}
              onBlur={field.onBlur}
              error={errors.age?.message}
              placeholder="Age"
              keyboardType="number-pad"
              maxLength={3}
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={() => {
                void handleSubmit(handleStartLearning)();
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
        label="Start Learning!"
        isLoading={isSubmitting}
        onPress={() => {
          void handleSubmit(handleStartLearning)();
        }}
      />
    </AuthScreenLayout>
  );
}
