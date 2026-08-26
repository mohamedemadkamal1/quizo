import type { AppLanguage, TextDirection } from './types';

export type LanguageRestartError =
  | 'language-switch-failed'
  | 'language-direction-mismatch';

export type LanguageRestartUiState = {
  isRestarting: boolean;
  targetLanguage: AppLanguage | null;
  error: LanguageRestartError | null;
};

export type LanguageRestartMarker = {
  targetLanguage: AppLanguage;
  targetDirection: TextDirection;
  recoveryAttempted: boolean;
};

export type LanguageSwitchResult =
  | 'already-active'
  | 'changed-without-reload'
  | 'reload-requested'
  | 'failed';

export type LanguageSwitchDependencies = {
  getActiveLanguage: () => AppLanguage;
  getNativeDirection: () => TextDirection;
  getDirection: (language: AppLanguage) => TextDirection;
  setRestartUi: (state: LanguageRestartUiState) => void;
  persistLanguage: (language: AppLanguage) => Promise<void>;
  applyLanguage: (language: AppLanguage) => void;
  invalidateLocalizedQueries: () => void;
  writeRestartMarker: (marker: LanguageRestartMarker) => Promise<void>;
  waitForRestartOverlayPaint: () => Promise<void>;
  configureNativeDirection: (direction: TextDirection) => void;
  reloadApp: (reason: string) => Promise<void>;
  reportError: (error: unknown) => void;
};

/**
 * Creates Quizo's one and only language-changing operation.
 *
 * The coordinator deliberately remains locked after the native reload request
 * succeeds. Expo resolves immediately before scheduling the runtime teardown,
 * so releasing the lock in that narrow gap could otherwise enqueue a second
 * reload from a rapid press or a development-only duplicate event.
 */
export function createLanguageSwitcher(deps: LanguageSwitchDependencies) {
  let inFlight: Promise<LanguageSwitchResult> | null = null;
  let reloadCommitted = false;

  return function switchLanguage(
    nextLanguage: AppLanguage,
  ): Promise<LanguageSwitchResult> {
    if (reloadCommitted && inFlight) {
      return inFlight;
    }

    if (inFlight) {
      return inFlight;
    }

    const operation = (async (): Promise<LanguageSwitchResult> => {
      if (deps.getActiveLanguage() === nextLanguage) {
        return 'already-active';
      }

      const targetDirection = deps.getDirection(nextLanguage);
      const directionChanges =
        deps.getNativeDirection() !== targetDirection;
      let restartOverlayPainted: Promise<void> | null = null;

      if (directionChanges) {
        deps.setRestartUi({
          isRestarting: true,
          targetLanguage: nextLanguage,
          error: null,
        });
        // Register synchronously, before persistence yields and React can
        // mount the overlay, so an early onLayout acknowledgement is not lost.
        restartOverlayPainted = deps.waitForRestartOverlayPaint();
      }

      try {
        // Disk and i18n are updated before the reload can destroy this runtime.
        await deps.persistLanguage(nextLanguage);
        deps.applyLanguage(nextLanguage);

        // Staleness/cancellation is intentionally fire-and-forget. A network
        // request must never hold the native restart path open.
        deps.invalidateLocalizedQueries();

        if (!directionChanges) {
          // A previously rejected reload can leave a forced direction pending
          // even though this runtime still renders in the requested direction.
          // Reset that pending flag without performing a redundant reload.
          deps.configureNativeDirection(targetDirection);
          return 'changed-without-reload';
        }

        await deps.writeRestartMarker({
          targetLanguage: nextLanguage,
          targetDirection,
          // This marker is consumed by the next runtime. It records that the
          // one permitted direction reload has already been requested, so
          // startup can never immediately issue a second reload.
          recoveryAttempted: true,
        });

        // The overlay is mounted above navigation. Its acknowledgement is sent
        // only after the target-language copy has committed and painted.
        await restartOverlayPainted;
        deps.configureNativeDirection(targetDirection);
        await deps.reloadApp('language-direction-change');

        reloadCommitted = true;
        return 'reload-requested';
      } catch (error) {
        deps.reportError(error);
        deps.setRestartUi({
          isRestarting: false,
          targetLanguage: nextLanguage,
          error: 'language-switch-failed',
        });
        return 'failed';
      }
    })();

    inFlight = operation;

    void operation.then((result) => {
      if (result !== 'reload-requested') {
        inFlight = null;
      }
    });

    return operation;
  };
}

export function parseLanguageRestartMarker(
  value: string | null,
): LanguageRestartMarker | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const marker = parsed as Record<string, unknown>;
    const validLanguage =
      marker.targetLanguage === 'en' || marker.targetLanguage === 'ar';
    const validDirection =
      marker.targetDirection === 'ltr' || marker.targetDirection === 'rtl';

    if (!validLanguage || !validDirection) {
      return null;
    }

    return {
      targetLanguage: marker.targetLanguage as AppLanguage,
      targetDirection: marker.targetDirection as TextDirection,
      recoveryAttempted: marker.recoveryAttempted === true,
    };
  } catch {
    return null;
  }
}

export type StartupDirectionResult =
  | 'in-sync'
  | 'direction-fallback'
  | 'recovery-reload-requested'
  | 'recovery-reload-failed';

export type StartupDirectionDependencies = {
  getNativeDirection: () => TextDirection;
  readRestartMarker: () => Promise<LanguageRestartMarker | null>;
  writeRestartMarker: (marker: LanguageRestartMarker) => Promise<void>;
  clearRestartMarker: () => Promise<void>;
  configureNativeDirection: (direction: TextDirection) => void;
  reloadApp: (reason: string) => Promise<void>;
  reportError: (error: unknown) => void;
};

/** Reconciles one interrupted direction change without permitting a loop. */
export async function reconcileStartupDirection(
  targetLanguage: AppLanguage,
  targetDirection: TextDirection,
  deps: StartupDirectionDependencies,
): Promise<StartupDirectionResult> {
  const marker = await deps.readRestartMarker();

  if (deps.getNativeDirection() === targetDirection) {
    if (marker) {
      try {
        await deps.clearRestartMarker();
      } catch (error) {
        // A stale marker is harmless once native direction is correct.
        deps.reportError(error);
      }
    }

    return 'in-sync';
  }

  const markerMatches =
    marker?.targetLanguage === targetLanguage &&
    marker.targetDirection === targetDirection;

  // A marker means the previous runtime already requested the one allowed
  // reload. Repeating it here creates the observed reload/Metro/white-screen
  // loop when iOS has not applied I18nManager's persisted flag yet. Every
  // Quizo React root and Modal has an explicit direction, so this runtime can
  // safely render in that direction while persisting the native flag for the
  // next cold process launch.
  if (markerMatches) {
    deps.configureNativeDirection(targetDirection);

    try {
      await deps.clearRestartMarker();
    } catch (error) {
      // A stale marker cannot trigger a loop because a matching marker never
      // reloads. Report the storage failure without blocking the application.
      deps.reportError(error);
    }

    return 'direction-fallback';
  }

  try {
    await deps.writeRestartMarker({
      targetLanguage,
      targetDirection,
      recoveryAttempted: true,
    });
    deps.configureNativeDirection(targetDirection);
    await deps.reloadApp('language-direction-recovery');
    return 'recovery-reload-requested';
  } catch (error) {
    deps.reportError(error);
    return 'recovery-reload-failed';
  }
}
