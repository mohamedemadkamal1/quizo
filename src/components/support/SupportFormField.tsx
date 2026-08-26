import { forwardRef } from 'react';
import type { TextInput, TextInputProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppTextInput } from '@/components/common/AppTextInput';

type SupportFormFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
  ltrContent?: boolean;
};

export const SupportFormField = forwardRef<TextInput, SupportFormFieldProps>(
  function SupportFormField(
    {
      label,
      error,
      editable = true,
      ltrContent = false,
      multiline = false,
      ...inputProps
    },
    ref,
  ) {
    return (
      <View style={styles.field}>
        <AppText alignToLanguage style={styles.label}>
          {label}
        </AppText>

        <View
          style={[
            styles.inputShell,
            multiline && styles.messageShell,
            error && styles.inputShellError,
            !editable && styles.disabled,
          ]}
        >
          <AppTextInput
            ref={ref}
            {...inputProps}
            editable={editable}
            ltrContent={ltrContent}
            multiline={multiline}
            placeholderTextColor="#9BAED4"
            style={[styles.input, multiline && styles.messageInput]}
          />
        </View>

        {error ? (
          <AppText
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            alignToLanguage
            style={styles.error}
          >
            {error}
          </AppText>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  field: {
    width: '100%',
    gap: 8,
  },
  label: {
    color: '#3E4A70',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  inputShell: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#B8C7FF',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  messageShell: {
    minHeight: 122,
    paddingVertical: 12,
  },
  inputShellError: {
    borderColor: '#E11D48',
  },
  input: {
    minWidth: 0,
    flex: 1,
    paddingVertical: 0,
    color: '#30335F',
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  messageInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  error: {
    paddingHorizontal: 4,
    color: '#BE123C',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
