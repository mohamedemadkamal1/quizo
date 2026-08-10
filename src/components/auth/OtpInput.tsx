import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const activeIndex = Math.min(value.length, OTP_LENGTH - 1);

  function handleChange(text: string) {
    const digitsOnly = text.replace(/\D/g, '');

    onChange(digitsOnly.slice(0, OTP_LENGTH));
  }

  return (
    <View className="relative h-[45px] w-[280px] max-w-full">
      <TextInput
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
        accessibilityLabel="Six-digit verification code"
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
              <Text className="font-fredoka text-[18px] font-semibold leading-[22px] text-muv-blue-300">
                {value[index] ?? ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
