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

      if (directionChanges) {
        deps.setRestartUi({
          isRestarting: true,
          targetLanguage: nextLanguage,
          error: null,
        });
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
          recoveryAttempted: false,
        });

        // The overlay is state-driven and mounted above navigation. Waiting for
        // its paint means native direction work cannot expose an empty frame.
        await deps.waitForRestartOverlayPaint();
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
  | 'recovery-reload-requested'
  | 'direction-mismatch'
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

  if (markerMatches && marker.recoveryAttempted) {
    return 'direction-mismatch';
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
