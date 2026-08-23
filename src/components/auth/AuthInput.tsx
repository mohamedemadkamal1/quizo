import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppTextInput } from '@/components/common/AppTextInput';
import { useTranslation } from '@/hooks/useTranslation';

type AuthInputProps = Omit<TextInputProps, 'style'> & {
  error?: string;
  /**
   * Keeps the field left-to-right in Arabic. Password fields set it
   * automatically; email and code fields opt in explicitly.
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
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPasswordInput = secureTextEntry;

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
            ref={ref}
            {...inputProps}
            editable={editable}
            secureTextEntry={isPasswordInput && !passwordVisible}
            placeholderTextColor="#8490C8"
            ltrContent={ltrContent || isPasswordInput}
            className="flex-1 font-nunito text-[14px] font-medium leading-5 text-muv-blue-300"
          />

          {isPasswordInput ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible
                  ? t('common.hidePassword')
                  : t('common.showPassword')
              }
              hitSlop={10}
              onPress={() => {
                setPasswordVisible((current) => !current);
              }}
            >
              <AppText className="font-nunito text-xs font-medium leading-4 text-muv-blue-300">
                {passwordVisible ? t('common.hide') : t('common.show')}
              </AppText>
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
});
