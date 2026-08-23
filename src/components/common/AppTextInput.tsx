import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import {
  getLanguageDirectionalTextStyle,
  getLanguageTextStyle,
  ltrInputContentTextStyle,
} from '@/theme/typography';

export type AppTextInputProps = TextInputProps & {
  /**
   * Keeps the value's character order left-to-right. Its physical alignment
   * still follows the active interface language, so technical values sit on
   * the right in Arabic without being reversed.
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
          getLanguageDirectionalTextStyle(language),
          ltrContent ? ltrInputContentTextStyle : null,
        ]}
      />
    );
  },
);
