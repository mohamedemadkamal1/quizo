import { useCallback, useRef, useState } from 'react';
import type { TextInput } from 'react-native';

/** Shared password visibility state with focus restoration for native fields. */
export function usePasswordVisibility(isPasswordInput: boolean) {
  const inputRef = useRef<TextInput | null>(null);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    if (!isPasswordInput) {
      return;
    }

    const shouldRestoreFocus = inputRef.current?.isFocused() ?? false;
    setPasswordVisible((current) => !current);

    if (shouldRestoreFocus) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isPasswordInput]);

  return {
    inputRef,
    isPasswordVisible,
    secureTextEntry: isPasswordInput && !isPasswordVisible,
    togglePasswordVisibility,
  };
}
