import { View } from 'react-native';

import { AppText } from '@/components/common/AppText';

type AuthHeadingProps = {
  title: string;
  subtitle: string;
};

export function AuthHeading({ title, subtitle }: AuthHeadingProps) {
  return (
    <View className="w-full items-center">
      <AppText
        accessibilityRole="header"
        className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300"
      >
        {title}
      </AppText>

      <AppText className="mt-2 max-w-[320px] text-center font-nunito text-[14px] font-medium leading-5 text-muv-blue-300">
        {subtitle}
      </AppText>
    </View>
  );
}
