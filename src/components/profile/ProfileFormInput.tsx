import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { colors } from '@/constants/colors';

type ProfileFormInputProps = Omit<TextInputProps, 'style'> & {
  error?: string;
  isPassword?: boolean;
};

export function ProfileFormInput({
  error,
  isPassword = false,
  editable = true,
  ...inputProps
}: ProfileFormInputProps) {
  const [isVisible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inputShell,
          error ? styles.inputShellError : undefined,
          !editable ? styles.inputShellDisabled : undefined,
        ]}
      >
        <TextInput
          {...inputProps}
          editable={editable}
          placeholderTextColor="#5D72D9"
          secureTextEntry={isPassword && !isVisible}
          style={styles.input}
        />

        {isPassword ? (
          <Pressable
            accessibilityLabel={isVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            disabled={!editable}
            hitSlop={10}
            onPress={() => setVisible((current) => !current)}
            style={styles.eyeButton}
          >
            <ProfileIcon name="eye" color="#4B63D7" size={22} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputShell: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(93, 114, 217, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 18,
    backgroundColor: '#F1F2F6',
    shadowColor: '#172554',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputShellError: {
    borderColor: '#E11D48',
  },
  inputShellDisabled: {
    opacity: 0.55,
  },
  input: {
    minWidth: 0,
    flex: 1,
    paddingVertical: 0,
    color: colors.muvBlue300,
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '500',
  },
  eyeButton: {
    width: 34,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    marginTop: 6,
    paddingHorizontal: 16,
    color: '#BE123C',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
