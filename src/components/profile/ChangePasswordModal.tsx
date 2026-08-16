import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthFormError } from '@/components/auth/AuthFormError';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthInput } from '@/components/auth/AuthInput';
import { AppButton } from '@/components/common/AppButton';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/schemas/profile.schemas';
import type { ChangePasswordRequest } from '@/types/profile.types';

type ChangePasswordModalProps = {
  visible: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onDismiss: () => void;
  onSubmit: (payload: ChangePasswordRequest) => Promise<boolean>;
};

const defaultValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export function ChangePasswordModal({
  visible,
  isSubmitting,
  errorMessage,
  onDismiss,
  onSubmit,
}: ChangePasswordModalProps) {
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
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
  const submit = handleSubmit(async ({ currentPassword, newPassword }) => {
    if (await onSubmit({ currentPassword, newPassword })) {
      reset(defaultValues);
    }
  });

  return (
    <ProfileModalFrame
      accessibilityLabel="Change password"
      isBusy={isSubmitting}
      maxWidth={360}
      onClose={dismiss}
      visible={visible}
    >
      <View style={styles.header}>
        <AuthHeading
          title="Change Password"
          subtitle="Update your password to keep your account secure."
        />
        <Pressable
          accessibilityLabel="Close"
          accessibilityRole="button"
          disabled={isSubmitting}
          hitSlop={10}
          onPress={dismiss}
          style={[styles.closeButton, isSubmitting && styles.disabled]}
        >
          <ProfileIcon name="close" color="#485BDD" size={24} />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <View className="w-[280px] max-w-full gap-4">
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onBlur, onChange, value }, fieldState }) => (
              <AuthInput
                key={`current-password-${visible}`}
                accessibilityLabel="Current password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect={false}
                editable={!isSubmitting}
                error={fieldState.error?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Current Password"
                returnKeyType="next"
                secureTextEntry
                textContentType="password"
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onBlur, onChange, value }, fieldState }) => (
              <AuthInput
                key={`new-password-${visible}`}
                accessibilityLabel="New password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                editable={!isSubmitting}
                error={fieldState.error?.message}
                maxLength={128}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="New Password"
                returnKeyType="next"
                secureTextEntry
                textContentType="newPassword"
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field: { onBlur, onChange, value }, fieldState }) => (
              <AuthInput
                key={`confirm-new-password-${visible}`}
                accessibilityLabel="Confirm new password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                editable={!isSubmitting}
                error={fieldState.error?.message}
                maxLength={128}
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => {
                  void submit();
                }}
                placeholder="Confirm New Password"
                returnKeyType="done"
                secureTextEntry
                textContentType="newPassword"
                value={value}
              />
            )}
          />

          <AuthFormError message={errorMessage ?? undefined} />
        </View>

        <AppButton
          isLoading={isSubmitting}
          label="Reset Password"
          onPress={() => {
            void submit();
          }}
        />
      </View>
    </ProfileModalFrame>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
  },
  disabled: {
    opacity: 0.5,
  },
});
