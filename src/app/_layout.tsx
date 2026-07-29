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

export default function RootLayout() {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const nativeSplashHidden = useRef(false);

  const session = useAuthStore((state) => state.session);

  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [authHydrated, setAuthHydrated] = useState(false);

  useEffect(() => {
    async function hydrateAuth() {
      try {
        await useAuthStore.persist.rehydrate();

        const storedSession = useAuthStore.getState().session;

        setApiAccessToken(storedSession?.accessToken ?? null);
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
    void SplashScreen.hideAsync();
  }, []);

  const handleAnimationFinish = useCallback(() => {
    setSplashAnimationFinished(true);
  }, []);

  return (
    <KeyboardProvider>
      <View style={styles.container} onLayout={handleRootLayout}>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        >
          <Stack.Protected guard={!session}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={Boolean(session)}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>

        {(!splashAnimationFinished || !authHydrated) && (
          <AnimatedSplash onFinish={handleAnimationFinish} />
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
