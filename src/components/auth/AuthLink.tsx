import { Pressable, View } from 'react-native';

import { AppText } from '@/components/common/AppText';

type AuthLinkProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthLink({ label, onPress, disabled = false }: AuthLinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      disabled={disabled}
      hitSlop={10}
      onPress={onPress}
      className={`active:opacity-60 ${disabled ? 'opacity-50' : ''}`}
    >
      <AppText className="font-nunito text-[12px] font-medium leading-4 text-muv-blue-300">
        {label}
      </AppText>
    </Pressable>
  );
}

type AuthPromptLinkProps = {
  prefix: string;
  action: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthPromptLink({
  prefix,
  action,
  onPress,
  disabled,
}: AuthPromptLinkProps) {
  return (
    <View className="flex-row flex-wrap items-center justify-center">
      <AppText className="font-nunito text-[12px] font-medium leading-4 text-muv-blue-300">
        {prefix}{' '}
      </AppText>

      <AuthLink label={action} onPress={onPress} disabled={disabled} />
    </View>
  );
}
