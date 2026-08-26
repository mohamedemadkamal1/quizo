import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import {
  ProfileModalError,
  ProfileModalSubmitButton,
} from '@/components/profile/ProfileModalElements';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import { SupportFormField } from '@/components/support/SupportFormField';
import { useTranslation } from '@/hooks/useTranslation';
import {
  createSupportSchema,
  type SupportFormValues,
} from '@/schemas/support.schema';
import { submitSupportRequest } from '@/services/support.service';
import { getSafeSupportErrorMessage } from '@/utils/get-api-error-message';

type SupportModalProps = {
  initialName: string;
  initialEmail: string;
  onDismiss: () => void;
};

const emptyValues: SupportFormValues = {
  name: '',
  email: '',
  message: '',
};

const fieldOrder: readonly (keyof SupportFormValues)[] = [
  'name',
  'email',
  'message',
];

export function SupportModal({
  initialName,
  initialEmail,
  onDismiss,
}: SupportModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createSupportSchema(t), [t]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isPending: isSubmitting, mutateAsync } = useMutation({
    mutationFn: submitSupportRequest,
    retry: false,
  });
  const { control, handleSubmit, reset, setFocus } =
    useForm<SupportFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: initialName.trim(),
        email: initialEmail.trim(),
        message: '',
      },
      shouldFocusError: true,
    });
  const dismiss = () => {
    if (!isSubmitting) {
      Keyboard.dismiss();
      onDismiss();
    }
  };
  const focusFirstInvalidField = useCallback(
    (errors: FieldErrors<SupportFormValues>) => {
      const firstInvalidField = fieldOrder.find((field) => errors[field]);

      if (firstInvalidField) {
        requestAnimationFrame(() => setFocus(firstInvalidField));
      }
    },
    [setFocus],
  );
  const submitValues = useCallback(
    async (values: SupportFormValues) => {
      if (isSubmitting) {
        return;
      }

      setErrorMessage(null);

      try {
        await mutateAsync({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        });
        reset(emptyValues);
        Keyboard.dismiss();
        setSubmitted(true);
      } catch (error) {
        setErrorMessage(
          getSafeSupportErrorMessage(error, t('support.modal.failure')),
        );
      }
    },
    [isSubmitting, mutateAsync, reset, t],
  );
  const submit = handleSubmit(submitValues, focusFirstInvalidField);

  return (
    <ProfileModalFrame
      accessibilityLabel={t('support.modal.dialogLabel')}
      isBusy={isSubmitting}
      maxWidth={390}
      onClose={dismiss}
      visible
    >
      <View style={styles.header}>
        <View style={styles.headingCopy}>
          <AppText accessibilityRole="header" style={styles.title}>
            {t('support.modal.title')}
          </AppText>
          <AppText alignToLanguage style={styles.subtitle}>
            {t('support.modal.subtitle')}
          </AppText>
        </View>
        <Pressable
          accessibilityLabel={t('common.close')}
          accessibilityRole="button"
          disabled={isSubmitting}
          hitSlop={10}
          onPress={dismiss}
          style={[styles.closeButton, isSubmitting && styles.disabled]}
        >
          <ProfileIcon name="close" color="#7183A5" size={21} />
        </Pressable>
      </View>

      {submitted ? (
        <View style={styles.successContent}>
          <AppText
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={styles.successMessage}
          >
            {t('support.modal.success')}
          </AppText>
          <ProfileModalSubmitButton isBusy={false} onPress={dismiss}>
            {t('support.modal.done')}
          </ProfileModalSubmitButton>
        </View>
      ) : (
        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onBlur, onChange, ref, value }, fieldState }) => (
              <SupportFormField
                ref={ref}
                accessibilityLabel={t('support.modal.fullNameLabel')}
                autoCapitalize="words"
                autoComplete="name"
                editable={!isSubmitting}
                error={fieldState.error?.message}
                label={t('support.modal.fullNameLabel')}
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => setFocus('email')}
                placeholder={t('support.modal.fullNamePlaceholder')}
                returnKeyType="next"
                textContentType="name"
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, ref, value }, fieldState }) => (
              <SupportFormField
                ref={ref}
                accessibilityLabel={t('support.modal.emailLabel')}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isSubmitting}
                error={fieldState.error?.message}
                inputMode="email"
                keyboardType="email-address"
                label={t('support.modal.emailLabel')}
                ltrContent
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => setFocus('message')}
                placeholder={t('support.modal.emailPlaceholder')}
                returnKeyType="next"
                textContentType="emailAddress"
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="message"
            render={({ field: { onBlur, onChange, ref, value }, fieldState }) => (
              <SupportFormField
                ref={ref}
                accessibilityLabel={t('support.modal.messageLabel')}
                editable={!isSubmitting}
                error={fieldState.error?.message}
                label={t('support.modal.messageLabel')}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t('support.modal.messagePlaceholder')}
                value={value}
              />
            )}
          />

          <ProfileModalError message={errorMessage} />
          <ProfileModalSubmitButton
            isBusy={isSubmitting}
            onPress={() => void submit()}
          >
            {t('support.modal.submit')}
          </ProfileModalSubmitButton>
        </View>
      )}
    </ProfileModalFrame>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 70,
    paddingEnd: 32,
  },
  headingCopy: {
    gap: 6,
  },
  title: {
    color: '#272A5C',
    fontFamily: 'Fredoka',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
  },
  subtitle: {
    color: '#7183A5',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    end: -8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 16,
    marginTop: 20,
  },
  successContent: {
    paddingTop: 30,
  },
  successMessage: {
    color: '#30335F',
    fontFamily: 'Nunito',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
