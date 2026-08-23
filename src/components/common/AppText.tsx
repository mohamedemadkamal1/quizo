import { forwardRef } from 'react';
import { Text, type TextProps } from 'react-native';

import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { getLanguageTextStyle, ltrContentTextStyle } from '@/theme/typography';

export type AppTextProps = TextProps & {
  /**
   * Keeps this text Latin and left-to-right even in Arabic. Use it for email
   * addresses, OTP codes, URLs and other technical identifiers.
   */
  ltrContent?: boolean;
};

/**
 * Drop-in replacement for React Native's `Text` that carries the writing
 * direction and the language's font family.
 *
 * Because the language styles are appended after the caller's own `style` (and
 * after any NativeWind `className`), a screen never has to restate the font or
 * the direction — it keeps writing the layout it already had.
 */
export const AppText = forwardRef<Text, AppTextProps>(function AppText(
  { ltrContent = false, style, ...textProps },
  ref,
) {
  const { language } = useLanguageDirection();

  return (
    <Text
      ref={ref}
      {...textProps}
      style={[
        style,
        getLanguageTextStyle(language),
        ltrContent ? ltrContentTextStyle : null,
      ]}
    />
  );
});
