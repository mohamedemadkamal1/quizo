import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ProfileFormInput } from '@/components/profile/ProfileFormInput';
import {
  DisabledSocialButtons,
  ProfileModalError,
  ProfileModalHeader,
  ProfileModalSubmitButton,
  profileModalStyles,
} from '@/components/profile/ProfileModalElements';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from '@/schemas/profile.schemas';

type CompleteProfileModalProps = {
  visible: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onDismiss: () => void;
  onSubmit: (email: string, password: string) => Promise<boolean>;
};

const defaultValues: CompleteProfileFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export function CompleteProfileModal({
  visible,
  isSubmitting,
  errorMessage,
  onDismiss,
  onSubmit,
}: CompleteProfileModalProps) {
  const { control, handleSubmit, reset } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (visible) {
      reset(defaultValues);
    }
  }, [reset, visible]);

  const dismiss = () => {
    reset(defaultValues);
    onDismiss();
  };
  const submit = handleSubmit(async ({ email, password }) => {
    if (await onSubmit(email, password)) {
      reset(defaultValues);
    }
  });

  return (
    <ProfileModalFrame
      accessibilityLabel="Complete your profile"
      isBusy={isSubmitting}
      onClose={dismiss}
      visible={visible}
    >
      <ProfileModalHeader
        isBusy={isSubmitting}
        onClose={dismiss}
        title="Complete Your Profile"
      />
      <View style={profileModalStyles.fields}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <ProfileFormInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isSubmitting}
              error={fieldState.error?.message}
              keyboardType="email-address"
              maxLength={120}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Email"
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <ProfileFormInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoComplete="new-password"
              editable={!isSubmitting}
              error={fieldState.error?.message}
              isPassword
              maxLength={128}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Password"
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onBlur, onChange, value }, fieldState }) => (
            <ProfileFormInput
              accessibilityLabel="Confirm password"
              autoCapitalize="none"
              autoComplete="new-password"
              editable={!isSubmitting}
              error={fieldState.error?.message}
              isPassword
              maxLength={128}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Confirm Password"
              returnKeyType="done"
              value={value}
            />
          )}
        />
      </View>
      <ProfileModalError message={errorMessage} />
      <ProfileModalSubmitButton isBusy={isSubmitting} onPress={submit}>
        Submit
      </ProfileModalSubmitButton>
      <DisabledSocialButtons />
    </ProfileModalFrame>
  );
}
