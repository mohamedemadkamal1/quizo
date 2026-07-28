import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <AuthHero />

        <View className="flex-1 items-center px-6 pb-4 pt-6">
          <Text className="text-center font-fredoka text-[30px] font-semibold leading-[36px] text-muv-blue-300">
            {title}
          </Text>

          <Text className="mt-2 max-w-[320px] text-center font-nunito text-[14px] font-medium leading-5 text-muv-blue-300">
            {subtitle}
          </Text>

          <View className="mt-8 w-full items-center gap-4 pt-3">
            {children}
          </View>

          {footer ? (
            <View className="mt-auto w-full items-center pt-6">{footer}</View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
