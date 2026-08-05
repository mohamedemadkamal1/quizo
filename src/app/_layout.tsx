import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import '../../global.css';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { setApiAccessToken } from '@/lib/api/api-client';

import { AnimatedSplash } from '@/components/splash/AnimatedSplash';

// Keep the native splash visible until React Native has rendered.
SplashScreen.preventAutoHideAsync().catch(() => {
  // It may already be prevented during Fast Refresh.
});

let authHydrationPromise: Promise<void> | null = null;

function restorePersistedAuth() {
  if (!authHydrationPromise) {
    authHydrationPromise = Promise.resolve(
      useAuthStore.persist.rehydrate(),
    ).finally(() => {
      const storedSession = useAuthStore.getState().session;

      setApiAccessToken(storedSession?.accessToken ?? null);
    });
  }

  return authHydrationPromise;
}

export default function RootLayout() {
  const nativeSplashHidden = useRef(false);

  const session = useAuthStore((state) => state.session);

  const hasSession = Boolean(session);

  const hasCompletedProfile = session?.user.profileCompleted === true;

  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [authHydrated, setAuthHydrated] = useState(false);

  useEffect(() => {
    async function hydrateAuth() {
      try {
        await restorePersistedAuth();
      } finally {
        setAuthHydrated(true);
      }
    }

    void hydrateAuth();
  }, []);

  const handleRootLayout = useCallback(() => {
    if (nativeSplashHidden.current) {
      return;
    }

    nativeSplashHidden.current = true;

    // The animated white screen has now been rendered,
    // so the native splash can safely disappear.
    SplashScreen.hide();
  }, []);

  const handleAnimationFinish = useCallback(() => {
    setSplashAnimationFinished(true);
  }, []);

  return (
    <KeyboardProvider>
      <View style={styles.container} onLayout={handleRootLayout}>
        <StatusBar style="dark" />

        {authHydrated ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          >
            <Stack.Protected guard={!hasSession}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={!hasSession || !hasCompletedProfile}>
              <Stack.Screen name="(profile)" />
            </Stack.Protected>

            <Stack.Protected guard={hasSession && hasCompletedProfile}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
          </Stack>
        ) : null}

        {(!splashAnimationFinished || !authHydrated) && (
          <AnimatedSplash
            readyToFinish={authHydrated}
            onFinish={handleAnimationFinish}
          />
        )}
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
