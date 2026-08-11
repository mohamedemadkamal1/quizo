import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import '../global.css';

import { AnimatedSplash } from '@/components/common/AnimatedSplash';
import { useAppInitialization } from '@/hooks/useAppInitialization';

const queryClient = new QueryClient();

export default function RootLayout() {
  const app = useAppInitialization();

  return (
    <QueryClientProvider client={queryClient}>
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
                <Stack.Screen
                  name="questions"
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name="level-complete"
                  options={{ gestureEnabled: false }}
                />
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
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
