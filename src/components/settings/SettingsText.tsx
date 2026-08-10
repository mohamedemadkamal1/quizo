import { Text as NativeText, type TextProps } from 'react-native';

export function SettingsText(props: TextProps) {
  return <NativeText allowFontScaling={false} {...props} />;
}
