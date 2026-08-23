import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { setApiAccessToken } from '@/services/api/api-client';
import { useAuthStore } from '@/store/auth.store';
import { hydrateLanguage } from '@/store/language.store';

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
  const { direction } = useLanguageDirection();
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [preferencesHydrated, setPreferencesHydrated] = useState(false);

  useEffect(() => {
    async function hydratePreferences() {
      try {
        // Authentication and language are restored together, and the language
        // hydration also brings the native layout direction in line, so the
        // navigation tree is only ever mounted once in its final direction.
        await Promise.all([restorePersistedAuth(), hydrateLanguage()]);
      } finally {
        setPreferencesHydrated(true);
      }
    }

    void hydratePreferences();
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
    isHydrated: preferencesHydrated,
    direction,
    hasSession: Boolean(session),
    hasCompletedProfile: session?.user.profileCompleted === true,
    showAnimatedSplash: !splashAnimationFinished || !preferencesHydrated,
    onRootLayout,
    onSplashAnimationFinish,
  };
}
