import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  type TextInputProps,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { SocialIconPlaceholders } from '@/components/profile/SocialIconPlaceholders';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useTranslation } from '@/hooks/useTranslation';
import {
  createCompleteProfileSchema,
  type CompleteProfileFormValues,
} from '@/schemas/profile.schemas';

type CompleteProfileModalProps = {
  visible: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onDismiss: () => void;
  onSubmit: (email: string, password: string) => Promise<boolean>;
};

type CompleteProfileInputProps = TextInputProps & {
  error?: string;
};

const defaultValues: CompleteProfileFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

function CompleteProfileInput({
  error,
  editable = true,
  ...inputProps
}: CompleteProfileInputProps) {
  return (
    <View style={styles.fieldWrapper}>
      {/* Technical values stay LTR, while field alignment follows the UI. */}
      <AppTextInput
        {...inputProps}
        editable={editable}
        ltrContent
        placeholderTextColor="#5D72D9"
        style={[
          styles.input,
          error && styles.inputError,
          !editable && styles.disabled,
        ]}
      />

      {error ? (
        <AppText accessibilityRole="alert" style={styles.fieldError}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function CompleteProfileModal({
  visible,
  isSubmitting,
  errorMessage,
  onDismiss,
  onSubmit,
}: CompleteProfileModalProps) {
  const { t } = useTranslation();
  const { directionStyle } = useLanguageDirection();
  const { width: windowWidth } = useWindowDimensions();
  const surfaceWidth = Math.min(315, windowWidth - 24);
  const scale = surfaceWidth / 315;
  const surfaceMinHeight = Math.round(399 * scale);
  const fieldWidth = Math.round(271 * scale);
  const submitWidth = Math.round(280 * scale);
  const schema = useMemo(() => createCompleteProfileSchema(t), [t]);
  const { control, handleSubmit, reset } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(schema),
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
    <Modal
      animationType="fade"
      onRequestClose={isSubmitting ? undefined : dismiss}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <SafeAreaView style={[styles.backdrop, directionStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.shadowContainer,
                { width: surfaceWidth, minHeight: surfaceMinHeight },
              ]}
            >
              <View
                accessibilityLabel={t('profile.completeModal.dialogLabel')}
                accessibilityViewIsModal
                style={[styles.surface, { minHeight: surfaceMinHeight }]}
              >
                <View pointerEvents="none" style={styles.decorativeEllipse} />

                <Pressable
                  accessibilityLabel={t('common.close')}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSubmitting }}
                  disabled={isSubmitting}
                  hitSlop={6}
                  onPress={dismiss}
                  style={[styles.closeButton, isSubmitting && styles.disabled]}
                >
                  <ProfileIcon color="#485BDD" name="close" size={29} />
                </Pressable>

                <AppText accessibilityRole="header" style={styles.title}>
                  {t('profile.completeModal.title')}
                </AppText>

                <View style={[styles.fields, { width: fieldWidth }]}>
                  <Controller
                    control={control}
                    name="email"
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState,
                    }) => (
                      <CompleteProfileInput
                        accessibilityLabel={t('auth.fields.email')}
                        autoCapitalize="none"
                        autoComplete="email"
                        editable={!isSubmitting}
                        error={fieldState.error?.message}
                        keyboardType="email-address"
                        maxLength={120}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder={t('auth.fields.email')}
                        value={value}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState,
                    }) => (
                      <CompleteProfileInput
                        accessibilityLabel={t('auth.fields.password')}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        editable={!isSubmitting}
                        error={fieldState.error?.message}
                        maxLength={128}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder={t('auth.fields.password')}
                        secureTextEntry
                        value={value}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState,
                    }) => (
                      <CompleteProfileInput
                        accessibilityLabel={t(
                          'profile.completeModal.confirmPasswordLabel',
                        )}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        editable={!isSubmitting}
                        error={fieldState.error?.message}
                        maxLength={128}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onSubmitEditing={submit}
                        placeholder={t('auth.fields.confirmPassword')}
                        returnKeyType="done"
                        secureTextEntry
                        value={value}
                      />
                    )}
                  />
                </View>

                {errorMessage ? (
                  <AppText
                    accessibilityLiveRegion="polite"
                    accessibilityRole="alert"
                    style={[styles.apiError, { width: fieldWidth }]}
                  >
                    {errorMessage}
                  </AppText>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    busy: isSubmitting,
                    disabled: isSubmitting,
                  }}
                  disabled={isSubmitting}
                  onPress={submit}
                  style={[
                    styles.submitButton,
                    { width: submitWidth },
                    isSubmitting && styles.disabled,
                  ]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <AppText numberOfLines={1} style={styles.submitLabel}>
                      {t('profile.completeModal.submit')}
                    </AppText>
                  )}
                </Pressable>

                <View style={styles.socialContainer}>
                  <SocialIconPlaceholders disabled={isSubmitting} />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 26, 77, 0.55)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  shadowContainer: {
    borderRadius: 12,
    backgroundColor: '#C6D2FF',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.34,
    shadowRadius: 18,
    elevation: 14,
  },
  surface: {
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(79, 91, 122, 0.5)',
    borderRadius: 12,
    paddingBottom: 20,
    backgroundColor: '#C6D2FF',
  },
  decorativeEllipse: {
    position: 'absolute',
    end: -34,
    bottom: 24,
    width: 176,
    height: 155,
    borderRadius: 88,
    backgroundColor: 'rgba(147, 164, 239, 0.34)',
    transform: [{ rotate: '18deg' }],
  },
  closeButton: {
    position: 'absolute',
    zIndex: 2,
    top: 8,
    end: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 50,
    color: '#485BDD',
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
  fields: {
    gap: 11,
    marginTop: 25,
  },
  fieldWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 0,
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 0,
    backgroundColor: '#F0F2F5',
    color: '#5D72D9',
    fontFamily: 'Fredoka',
    fontSize: 17,
    fontWeight: '500',
    textAlignVertical: 'center',
    shadowColor: '#172554',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E11D48',
  },
  fieldError: {
    marginTop: 3,
    paddingHorizontal: 14,
    color: '#BE123C',
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
  apiError: {
    marginTop: 7,
    color: '#BE123C',
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    textAlign: 'center',
  },
  submitButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 23,
    backgroundColor: '#4F46E5',
    shadowColor: '#312E81',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 5,
  },
  submitLabel: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  socialContainer: {
    zIndex: 1,
    marginTop: 10,
  },
  disabled: {
    opacity: 0.55,
  },
});
