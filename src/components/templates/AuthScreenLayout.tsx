import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '@/components/organisms/AuthHero';

type AuthScreenLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footer?: ReactNode;
}>;

export function AuthScreenLayout({
  title,
  subtitle,
  footer,
  children,
}: AuthScreenLayoutProps) {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        bounces={false}
      >
        <AuthHero />

        <View className="flex-1 items-center px-6 pb-6 pt-5">
          <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
            {title}
          </Text>

          <Text className="mt-2 max-w-[320px] text-center font-nunito text-[14px] font-medium leading-5 text-muv-blue-300">
            {subtitle}
          </Text>

          <View className="mt-6 w-full items-center gap-4">{children}</View>

          {footer ? (
            <View className="mt-6 w-full items-center">{footer}</View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
  },
});
