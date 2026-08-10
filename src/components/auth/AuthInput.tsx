import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type AuthInputProps = Omit<TextInputProps, 'style'> & {
  error?: string;
};

export const AuthInput = forwardRef<TextInput, AuthInputProps>(
  function AuthInput(
    { error, secureTextEntry = false, editable = true, ...inputProps },
    ref,
  ) {
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
          <TextInput
            ref={ref}
            {...inputProps}
            editable={editable}
            secureTextEntry={isPasswordInput && !passwordVisible}
            placeholderTextColor="#8490C8"
            className="flex-1 font-nunito text-[14px] font-medium leading-5 text-muv-blue-300"
          />

          {isPasswordInput ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible ? 'Hide password' : 'Show password'
              }
              hitSlop={10}
              onPress={() => {
                setPasswordVisible((current) => !current);
              }}
            >
              <Text className="font-nunito text-xs font-medium leading-4 text-muv-blue-300">
                {passwordVisible ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text className="mt-1 px-3 font-nunito text-xs font-medium leading-4 text-red-500">
            {error}
          </Text>
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
