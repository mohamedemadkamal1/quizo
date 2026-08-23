import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppTextInput } from '@/components/common/AppTextInput';
import { useTranslation } from '@/hooks/useTranslation';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  editable?: boolean;
};

const OTP_LENGTH = 6;

export function OtpInput({
  value,
  onChange,
  autoFocus = false,
  editable = true,
}: OtpInputProps) {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const activeIndex = Math.min(value.length, OTP_LENGTH - 1);

  function handleChange(text: string) {
    const digitsOnly = text.replace(/\D/g, '');

    onChange(digitsOnly.slice(0, OTP_LENGTH));
  }

  return (
    // The boxes are a fixed left-to-right sequence in both languages: an OTP
    // is a technical code, so its digit order never mirrors.
    <View
      style={styles.container}
      className="relative h-[45px] w-[280px] max-w-full"
    >
      <AppTextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        editable={editable}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        textContentType="oneTimeCode"
        caretHidden
        ltrContent
        accessibilityLabel={t('auth.verifyEmail.codeLabel')}
        className="absolute inset-0 z-10 opacity-0"
      />

      <View pointerEvents="none" className="flex-1 flex-row justify-between">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => {
          const isActive =
            focused && index === activeIndex && value.length < OTP_LENGTH;

          return (
            <View
              key={index}
              style={[styles.box, isActive && styles.activeBox]}
              className="items-center justify-center"
            >
              <AppText
                ltrContent
                className="font-fredoka text-[18px] font-semibold leading-[22px] text-muv-blue-300"
                style={styles.digit}
              >
                {value[index] ?? ''}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: 'ltr',
  },

  box: {
    width: 40,
    height: 45,
    borderRadius: 6,
    borderWidth: 0.91,
    borderColor: '#485BDD',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },

  activeBox: {
    borderWidth: 1.5,
  },

  digit: {
    textAlign: 'center',
  },
});
