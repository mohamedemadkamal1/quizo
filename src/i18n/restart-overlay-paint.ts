let resolvePendingPaint: (() => void) | null = null;

/**
 * Arms the one-shot paint acknowledgement before React gets a chance to mount
 * the restart overlay. The language switch coordinator is single-flight, so
 * there can only be one pending acknowledgement.
 */
export function waitForRestartOverlayPaint(): Promise<void> {
  return new Promise((resolve) => {
    resolvePendingPaint = resolve;
  });
}

/** Called by the mounted overlay after its target-language copy has painted. */
export function notifyRestartOverlayPainted(): void {
  const resolve = resolvePendingPaint;

  if (!resolve) {
    return;
  }

  resolvePendingPaint = null;
  resolve();
}

