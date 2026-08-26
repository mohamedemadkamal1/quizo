import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { setApiAccessToken } from '@/services/api/api-client';
import { useAuthStore } from '@/store/auth.store';
import { hydrateLanguage, useLanguageStore } from '@/store/language.store';
import {
  hydratePreferences as hydrateStoredPreferences,
} from '@/store/preferences.store';

let authHydrationPromise: Promise<void> | null = null;

function restorePersistedAuth() {
  if (!authHydrationPromise) {
    authHydrationPromise = Promise.resolve(useAuthStore.persist.rehydrate())
      .finally(() => {
        const storedSession = useAuthStore.getState().session;
        setApiAccessToken(storedSession?.accessToken ?? null);
      })
      .catch((error) => {
        authHydrationPromise = null;
        throw error;
      });
  }

  return authHydrationPromise;
}

export function useAppInitialization() {
  const nativeSplashHidden = useRef(false);
  const session = useAuthStore((state) => state.session);
  const languageIsHydrated = useLanguageStore((state) => state.isHydrated);
  const didStartFromLanguageReload = useLanguageStore(
    (state) => state.didStartFromLanguageReload,
  );
  const { direction } = useLanguageDirection();
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [initializationFinalized, setInitializationFinalized] = useState(false);
  const [initializationFailed, setInitializationFailed] = useState(false);
  const [initializationAttempt, setInitializationAttempt] = useState(0);
  const [rootLaidOut, setRootLaidOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function initializeAppState() {
      setInitializationFailed(false);
      setInitializationFinalized(false);

      try {
        // Authentication and language are restored together, and the language
        // hydration also brings the native layout direction in line, so the
        // navigation tree is only ever mounted once in its final direction.
        await Promise.all([
          restorePersistedAuth(),
          hydrateLanguage(),
          hydrateStoredPreferences(),
        ]);
      } catch (error) {
        console.error(
          `[initialization] Failed to restore app state: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );

        if (active) {
          setInitializationFailed(true);
        }
      } finally {
        if (active) {
          setInitializationFinalized(true);
        }
      }
    }

    void initializeAppState();

    return () => {
      active = false;
    };
  }, [initializationAttempt]);

  const onRootLayout = useCallback(() => {
    setRootLaidOut(true);
  }, []);

  useEffect(() => {
    if (
      !initializationFinalized ||
      !rootLaidOut ||
      nativeSplashHidden.current
    ) {
      return;
    }

    // The finalized loading/error/navigation view is committed before the
    // native splash leaves, so a white native root is never exposed.
    const frame = requestAnimationFrame(() => {
      nativeSplashHidden.current = true;
      SplashScreen.hide();
    });

    return () => cancelAnimationFrame(frame);
  }, [initializationFinalized, rootLaidOut]);

  const onSplashAnimationFinish = useCallback(() => {
    setSplashAnimationFinished(true);
  }, []);

  const retryInitialization = useCallback(() => {
    setInitializationAttempt((attempt) => attempt + 1);
  }, []);

  return {
    isHydrated: initializationFinalized && !initializationFailed,
    initializationFinalized,
    initializationFailed,
    direction,
    hasSession: Boolean(session),
    hasCompletedProfile: session?.user.profileCompleted === true,
    // A direction reload already showed the global switching overlay and the
    // native splash. Replaying the 2.3-second introduction makes a healthy
    // reload look like a hang, so it is reserved for ordinary cold launches.
    showAnimatedSplash:
      languageIsHydrated &&
      !didStartFromLanguageReload &&
      !splashAnimationFinished,
    onRootLayout,
    onSplashAnimationFinish,
    retryInitialization,
  };
}
