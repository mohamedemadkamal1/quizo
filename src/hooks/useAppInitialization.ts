import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';

import { setApiAccessToken } from '@/services/api/api-client';
import { useAuthStore } from '@/store/auth.store';

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

export function useAppInitialization() {
  const nativeSplashHidden = useRef(false);
  const session = useAuthStore((state) => state.session);
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

  const onRootLayout = useCallback(() => {
    if (nativeSplashHidden.current) {
      return;
    }

    nativeSplashHidden.current = true;
    SplashScreen.hide();
  }, []);

  const onSplashAnimationFinish = useCallback(() => {
    setSplashAnimationFinished(true);
  }, []);

  return {
    authHydrated,
    hasSession: Boolean(session),
    hasCompletedProfile: session?.user.profileCompleted === true,
    showAnimatedSplash: !splashAnimationFinished || !authHydrated,
    onRootLayout,
    onSplashAnimationFinish,
  };
}
