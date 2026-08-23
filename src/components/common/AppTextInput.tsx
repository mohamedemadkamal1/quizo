import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { getLanguageTextStyle, ltrContentTextStyle } from '@/theme/typography';

export type AppTextInputProps = TextInputProps & {
  /**
   * Keeps the field left-to-right and left-aligned even in Arabic, which is
   * what email, password, OTP and identifier inputs need.
   */
  ltrContent?: boolean;
};

/**
 * `TextInput` with the same centralized language typography and direction
 * handling as {@link AppText}.
 */
export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  function AppTextInput({ ltrContent = false, style, ...inputProps }, ref) {
    const { language } = useLanguageDirection();

    return (
      <TextInput
        ref={ref}
        {...inputProps}
        style={[
          style,
          getLanguageTextStyle(language),
          ltrContent ? ltrContentTextStyle : null,
        ]}
      />
    );
  },
);
