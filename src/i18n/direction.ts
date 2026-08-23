import { reloadAppAsync } from 'expo';
import { I18nManager } from 'react-native';

import type { TextDirection } from '@/i18n/types';

/**
 * The direction React Native's native layer booted with.
 *
 * `I18nManager.forceRTL` does not flip the running native layout, so comparing
 * against a value captured once at startup is what keeps a direction change
 * from reloading the app again after it has already restarted.
 */
const nativeDirectionAtStartup: TextDirection = I18nManager.isRTL
  ? 'rtl'
  : 'ltr';

/**
 * React Native mirrors physical `left`/`right` styles in RTL by default, which
 * would flip Quizo's pixel-positioned canvases — the question board, the level
 * results, the level-start dialog and the leaderboard podium — away from the
 * SVG artwork underneath them, since SVG viewBox coordinates never mirror.
 *
 * Physical edges therefore stay physical and every genuinely directional edge
 * is expressed with `start`/`end` instead. Row order still follows the
 * language, because that comes from the layout direction rather than this flag.
 */
I18nManager.swapLeftAndRightInRTL(false);

let reloadRequested = false;

export type DirectionSyncResult =
  /** Native layout already matches; nothing to do. */
  | 'in-sync'
  /** The native flags were updated and a reload was triggered. */
  | 'reloaded'
  /**
   * The native flags were updated but the runtime refused to reload, so the
   * new direction only takes effect on the next manual launch. Expo Go on
   * SDK 57 behaves this way.
   */
  | 'reload-unavailable';

export function getNativeDirection(): TextDirection {
  return nativeDirectionAtStartup;
}

export function isNativeDirectionInSync(direction: TextDirection): boolean {
  return nativeDirectionAtStartup === direction;
}

/**
 * Aligns React Native's native RTL flags with `direction`, restarting the app
 * only when the native layout actually has to flip.
 *
 * Callers must persist the language *before* awaiting this, because a
 * successful reload never returns.
 */
export async function syncNativeDirection(
  direction: TextDirection,
): Promise<DirectionSyncResult> {
  if (isNativeDirectionInSync(direction) || reloadRequested) {
    return 'in-sync';
  }

  const shouldBeRtl = direction === 'rtl';

  reloadRequested = true;
  I18nManager.allowRTL(shouldBeRtl);
  I18nManager.forceRTL(shouldBeRtl);

  try {
    await reloadAppAsync('Quizo language direction changed');
    return 'reloaded';
  } catch {
    // Development clients that cannot restart themselves keep running with the
    // JavaScript direction applied at the React root; the native layout picks
    // the new flags up on the next launch.
    reloadRequested = false;
    return 'reload-unavailable';
  }
}
