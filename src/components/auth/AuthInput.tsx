import {
  forwardRef,
  useCallback,
  type MutableRefObject,
} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { PasswordVisibilityIcon } from '@/components/common/icons/PasswordVisibilityIcon';
import { AppTextInput } from '@/components/common/AppTextInput';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import { useTranslation } from '@/hooks/useTranslation';

type AuthInputProps = Omit<TextInputProps, 'style'> & {
  error?: string;
  /**
   * Keeps the value's character order left-to-right. Password fields set it
   * automatically; email and code fields opt in explicitly. Field alignment
   * still follows the interface language.
   */
  ltrContent?: boolean;
};

export const AuthInput = forwardRef<TextInput, AuthInputProps>(
  function AuthInput(
    {
      error,
      secureTextEntry = false,
      editable = true,
      ltrContent = false,
      ...inputProps
    },
    ref,
  ) {
    const { t } = useTranslation();
    const isPasswordInput = secureTextEntry;
    const {
      inputRef,
      isPasswordVisible,
      secureTextEntry: resolvedSecureTextEntry,
      togglePasswordVisibility,
    } = usePasswordVisibility(isPasswordInput);
    const setInputRef = useCallback(
      (input: TextInput | null) => {
        inputRef.current = input;

        if (typeof ref === 'function') {
          ref(input);
        } else if (ref) {
          (ref as MutableRefObject<TextInput | null>).current = input;
        }
      },
      [inputRef, ref],
    );

    return (
      <View className="w-[280px] max-w-full">
        <View
          className={[
            'h-[45px] flex-row items-center rounded-[30px] border bg-button-secondary px-6',
            error ? 'border-red-500' : 'border-button-secondary-border',
            !editable ? 'opacity-50' : '',
          ].join(' ')}
          style={styles.shadow}
        >
          <AppTextInput
            ref={setInputRef}
            {...inputProps}
            editable={editable}
            secureTextEntry={resolvedSecureTextEntry}
            placeholderTextColor="#8490C8"
            ltrContent={ltrContent || isPasswordInput}
            className="flex-1 font-nunito text-[14px] font-medium leading-5 text-muv-blue-300"
          />

          {isPasswordInput ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible
                  ? t('common.hidePassword')
                  : t('common.showPassword')
              }
              disabled={!editable}
              onPress={togglePasswordVisibility}
              style={styles.eyeButton}
            >
              <PasswordVisibilityIcon
                color="#485BDD"
                visible={isPasswordVisible}
              />
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <AppText className="mt-1 px-3 font-nunito text-xs font-medium leading-4 text-red-500">
            {error}
          </AppText>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  shadow: {
    boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  eyeButton: {
    width: 44,
    height: 44,
    marginEnd: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
