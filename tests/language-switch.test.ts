import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  createLanguageSwitcher,
  reconcileStartupDirection,
  type LanguageRestartMarker,
  type LanguageRestartUiState,
  type LanguageSwitchDependencies,
} from '../src/i18n/language-switch.ts';
import type {
  AppLanguage,
  TextDirection,
} from '../src/i18n/types.ts';

function directionFor(language: AppLanguage): TextDirection {
  return language === 'ar' ? 'rtl' : 'ltr';
}

function createSwitchHarness(
  initialLanguage: AppLanguage,
  nativeDirection: TextDirection,
  reloadApp: LanguageSwitchDependencies['reloadApp'] = async () => {},
) {
  let activeLanguage = initialLanguage;
  let persistedLanguage = initialLanguage;
  let i18nLocale = initialLanguage;
  let marker: LanguageRestartMarker | null = null;
  let ui: LanguageRestartUiState = {
    isRestarting: false,
    targetLanguage: null,
    error: null,
  };
  const events: string[] = [];

  const switchLanguage = createLanguageSwitcher({
    getActiveLanguage: () => activeLanguage,
    getNativeDirection: () => nativeDirection,
    getDirection: directionFor,
    setRestartUi: (state) => {
      ui = state;
      events.push(state.isRestarting ? 'show-loader' : `error:${state.error}`);
    },
    persistLanguage: async (language) => {
      persistedLanguage = language;
      events.push(`persist:${language}`);
    },
    applyLanguage: (language) => {
      activeLanguage = language;
      i18nLocale = language;
      events.push(`apply:${language}`);
    },
    invalidateLocalizedQueries: () => {
      events.push('invalidate-queries');
    },
    writeRestartMarker: async (nextMarker) => {
      marker = nextMarker;
      events.push('write-marker');
    },
    waitForRestartOverlayPaint: async () => {
      events.push('overlay-painted');
    },
    configureNativeDirection: (direction) => {
      events.push(`configure:${direction}`);
    },
    reloadApp: async (reason) => {
      events.push(`reload:${reason}`);
      await reloadApp(reason);
    },
    reportError: () => {
      events.push('diagnostic');
    },
  });

  return {
    switchLanguage,
    events,
    get activeLanguage() {
      return activeLanguage;
    },
    get persistedLanguage() {
      return persistedLanguage;
    },
    get i18nLocale() {
      return i18nLocale;
    },
    get marker() {
      return marker;
    },
    get ui() {
      return ui;
    },
  };
}

test('selecting the active language closes as a no-op and never reloads', async () => {
  let reloads = 0;
  const harness = createSwitchHarness('en', 'ltr', async () => {
    reloads += 1;
  });

  assert.equal(await harness.switchLanguage('en'), 'already-active');
  assert.equal(reloads, 0);
  assert.deepEqual(harness.events, []);
  assert.equal(harness.ui.isRestarting, false);
});

test('simulated iOS English to Arabic paints the loader, persists, configures RTL, and reloads once', async () => {
  let reloads = 0;
  const harness = createSwitchHarness('en', 'ltr', async () => {
    reloads += 1;
    assert.equal(harness.persistedLanguage, 'ar');
    assert.equal(harness.i18nLocale, 'ar');
  });

  assert.equal(await harness.switchLanguage('ar'), 'reload-requested');
  assert.equal(reloads, 1);
  assert.equal(harness.activeLanguage, 'ar');
  assert.equal(harness.marker?.targetDirection, 'rtl');
  assert.equal(harness.ui.isRestarting, true);
  assert.deepEqual(harness.events, [
    'show-loader',
    'overlay-painted',
    'persist:ar',
    'apply:ar',
    'invalidate-queries',
    'write-marker',
    'configure:rtl',
    'reload:language-direction-change',
  ]);
});

test('simulated iOS Arabic to English performs the equivalent LTR flow', async () => {
  let reloads = 0;
  const harness = createSwitchHarness('ar', 'rtl', async () => {
    reloads += 1;
  });

  assert.equal(await harness.switchLanguage('en'), 'reload-requested');
  assert.equal(reloads, 1);
  assert.equal(harness.persistedLanguage, 'en');
  assert.equal(harness.i18nLocale, 'en');
  assert.ok(harness.events.includes('configure:ltr'));
});

test('rapid repeated language presses share one flight and request at most one reload', async () => {
  let startReload: (() => void) | undefined;
  let finishReload: (() => void) | undefined;
  let reloads = 0;
  const reloadStarted = new Promise<void>((resolve) => {
    startReload = resolve;
  });
  const reloadFinished = new Promise<void>((resolve) => {
    finishReload = resolve;
  });
  const harness = createSwitchHarness('en', 'ltr', async () => {
    reloads += 1;
    startReload?.();
    await reloadFinished;
  });

  const first = harness.switchLanguage('ar');
  const second = harness.switchLanguage('ar');
  const third = harness.switchLanguage('en');

  assert.strictEqual(second, first);
  assert.strictEqual(third, first);
  await reloadStarted;
  assert.equal(reloads, 1);

  finishReload?.();
  await Promise.all([first, second, third]);
  assert.equal(reloads, 1);

  await harness.switchLanguage('ar');
  assert.equal(reloads, 1);
});

test('a rejected reload hides the loader, releases the flight, and exposes a recoverable error', async () => {
  let reloads = 0;
  const harness = createSwitchHarness('en', 'ltr', async () => {
    reloads += 1;
    throw new Error('reload unavailable');
  });

  assert.equal(await harness.switchLanguage('ar'), 'failed');
  assert.equal(reloads, 1);
  assert.deepEqual(harness.ui, {
    isRestarting: false,
    targetLanguage: 'ar',
    error: 'language-switch-failed',
  });
  assert.ok(harness.events.includes('diagnostic'));
  assert.equal(await harness.switchLanguage('ar'), 'already-active');
});

test('switching back after a rejected reload clears the pending direction without another reload', async () => {
  let reloads = 0;
  const harness = createSwitchHarness('ar', 'ltr', async () => {
    reloads += 1;
  });

  assert.equal(
    await harness.switchLanguage('en'),
    'changed-without-reload',
  );
  assert.equal(reloads, 0);
  assert.ok(harness.events.includes('configure:ltr'));
  assert.equal(harness.ui.isRestarting, false);
});

test('startup hydration completes and clears the marker when the restarted native direction matches', async () => {
  let marker: LanguageRestartMarker | null = {
    targetLanguage: 'ar',
    targetDirection: 'rtl',
    recoveryAttempted: false,
  };
  let reloads = 0;

  const result = await reconcileStartupDirection('ar', 'rtl', {
    getNativeDirection: () => 'rtl',
    readRestartMarker: async () => marker,
    writeRestartMarker: async (value) => {
      marker = value;
    },
    clearRestartMarker: async () => {
      marker = null;
    },
    configureNativeDirection: () => {},
    reloadApp: async () => {
      reloads += 1;
    },
    reportError: () => {},
  });

  assert.equal(result, 'in-sync');
  assert.equal(marker, null);
  assert.equal(reloads, 0);
});

test('startup never repeats a reload recorded by the previous runtime', async () => {
  let marker: LanguageRestartMarker | null = {
    targetLanguage: 'ar',
    targetDirection: 'rtl',
    recoveryAttempted: true,
  };
  let reloads = 0;
  const dependencies = {
    getNativeDirection: () => 'ltr' as const,
    readRestartMarker: async () => marker,
    writeRestartMarker: async (value: LanguageRestartMarker) => {
      marker = value;
    },
    clearRestartMarker: async () => {
      marker = null;
    },
    configureNativeDirection: () => {},
    reloadApp: async () => {
      reloads += 1;
    },
    reportError: () => {},
  };

  assert.equal(
    await reconcileStartupDirection('ar', 'rtl', dependencies),
    'direction-fallback',
  );
  assert.equal(reloads, 0);
  assert.equal(marker, null);
});

test('startup can request one initial direction reload when no marker exists', async () => {
  let marker: LanguageRestartMarker | null = null;
  let reloads = 0;
  const dependencies = {
    getNativeDirection: () => 'ltr' as const,
    readRestartMarker: async () => marker,
    writeRestartMarker: async (value: LanguageRestartMarker) => {
      marker = value;
    },
    clearRestartMarker: async () => {
      marker = null;
    },
    configureNativeDirection: () => {},
    reloadApp: async () => {
      reloads += 1;
    },
    reportError: () => {},
  };

  assert.equal(
    await reconcileStartupDirection('ar', 'rtl', dependencies),
    'recovery-reload-requested',
  );
  assert.equal(reloads, 1);

  assert.equal(
    await reconcileStartupDirection('ar', 'rtl', dependencies),
    'direction-fallback',
  );
  assert.equal(reloads, 1);
  assert.equal(marker, null);
});

test('both selectors share the central operation, requests read current language, and root initialization is visible', async () => {
  const workspace = process.cwd();
  const [authSelector, profileActions, dropdown, rootLayout, direction, apiClient] =
    await Promise.all([
      readFile(
        path.join(workspace, 'src/components/auth/AuthLanguageSelector.tsx'),
        'utf8',
      ),
      readFile(
        path.join(workspace, 'src/components/profile/ProfileActions.tsx'),
        'utf8',
      ),
      readFile(
        path.join(workspace, 'src/components/common/LanguageDropdown.tsx'),
        'utf8',
      ),
      readFile(path.join(workspace, 'app/_layout.tsx'), 'utf8'),
      readFile(path.join(workspace, 'src/i18n/direction.ts'), 'utf8'),
      readFile(
        path.join(workspace, 'src/services/api/api-client.ts'),
        'utf8',
      ),
    ]);

  assert.match(authSelector, /LanguageDropdown/);
  assert.match(profileActions, /LanguageDropdown/);
  assert.match(dropdown, /useLanguageSelection/);
  assert.doesNotMatch(authSelector + profileActions + dropdown, /forceRTL|reloadApp/);
  assert.match(rootLayout, /AppInitializationState/);
  assert.match(rootLayout, /LanguageRestartOverlay/);
  assert.match(direction, /import \* as Expo from 'expo'/);
  assert.match(direction, /I18nManager\.allowRTL\(true\)/);
  assert.match(direction, /Expo\.reloadAppAsync\(reason\)/);
  assert.match(apiClient, /waitForLanguageHydration: hydrateLanguage/);
  assert.match(apiClient, /getLanguage: getStoredLanguage/);
});
