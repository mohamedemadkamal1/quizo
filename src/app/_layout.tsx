import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import '../../global.css';

import { AnimatedSplash } from '@/components/splash/AnimatedSplash';

// Keep the native splash visible until React Native has rendered.
SplashScreen.preventAutoHideAsync().catch(() => {
  // It may already be prevented during Fast Refresh.
});

export default function RootLayout() {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const nativeSplashHidden = useRef(false);

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
    setShowAnimatedSplash(false);
  }, []);

  return (
    <View style={styles.container} onLayout={handleRootLayout}>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      {showAnimatedSplash && (
        <AnimatedSplash onFinish={handleAnimationFinish} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
