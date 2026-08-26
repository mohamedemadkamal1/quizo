import { QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import '../global.css';

import { AnimatedSplash } from '@/components/common/AnimatedSplash';
import { AppInitializationState } from '@/components/common/AppInitializationState';
import { LanguageRestartOverlay } from '@/components/common/LanguageRestartOverlay';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { queryClient } from '@/services/api/query-client';
import {
  AUTH_STORAGE_KEY,
  LANGUAGE_RESTART_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  PREFERENCES_STORAGE_KEY,
} from '@/store/storage-keys';

void Promise.all(
  [
    AUTH_STORAGE_KEY,
    LANGUAGE_STORAGE_KEY,
    LANGUAGE_RESTART_STORAGE_KEY,
    PREFERENCES_STORAGE_KEY,
  ].map((key) => SecureStore.deleteItemAsync(key)),
).then(() => console.info('[simulator-reset] Secure storage cleared'));

// SDK 57 recommends keeping this at module scope so native auto-hide cannot
// win the race against React initialization.
void SplashScreen.preventAutoHideAsync().catch(() => {
  // Fast Refresh may evaluate this after the splash has already been handled.
});

export default function RootLayout() {
  const app = useAppInitialization();

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        {/*
          Declaring the direction once at the root of the React tree is what
          makes every `row`, `start` and `end` below follow the language, and
          it keeps working in development clients that cannot restart to pick
          up the native RTL flags.
        */}
        <View
          style={[styles.container, { direction: app.direction }]}
          onLayout={app.onRootLayout}
        >
          <StatusBar style="dark" />

          {app.isHydrated ? (
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
                <Stack.Screen name="level-complete-leaderboard" />
                <Stack.Screen
                  name="level-failed"
                  options={{ gestureEnabled: false }}
                />
              </Stack.Protected>
            </Stack>
          ) : (
            <AppInitializationState
              error={
                app.initializationFinalized && app.initializationFailed
              }
              onRetry={app.retryInitialization}
            />
          )}

          {app.showAnimatedSplash ? (
            <AnimatedSplash
              readyToFinish={app.initializationFinalized}
              onFinish={app.onSplashAnimationFinish}
            />
          ) : null}

          <LanguageRestartOverlay />
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
