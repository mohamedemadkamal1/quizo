import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import '../global.css';

import { AnimatedSplash } from '@/components/common/AnimatedSplash';
import { useAppInitialization } from '@/hooks/useAppInitialization';

export default function RootLayout() {
  const app = useAppInitialization();

  return (
    <KeyboardProvider>
      <View style={styles.container} onLayout={app.onRootLayout}>
        <StatusBar style="dark" />

        {app.authHydrated ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FFFFFF' },
            }}
          >
            <Stack.Protected guard={!app.hasSession}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected
              guard={!app.hasSession || !app.hasCompletedProfile}
            >
              <Stack.Screen name="(profile)" />
            </Stack.Protected>

            <Stack.Protected
              guard={app.hasSession && app.hasCompletedProfile}
            >
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>
          </Stack>
        ) : null}

        {app.showAnimatedSplash ? (
          <AnimatedSplash
            readyToFinish={app.authHydrated}
            onFinish={app.onSplashAnimationFinish}
          />
        ) : null}
      </View>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
