import * as Expo from 'expo';
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

let configuredDirection: TextDirection = nativeDirectionAtStartup;

export function getNativeDirection(): TextDirection {
  return nativeDirectionAtStartup;
}

export function configureNativeDirection(direction: TextDirection): void {
  // RTL support stays enabled for both languages. `forceRTL(false)` selects
  // LTR; disabling RTL entirely would prevent the next Arabic selection.
  I18nManager.allowRTL(true);

  if (configuredDirection !== direction) {
    I18nManager.forceRTL(direction === 'rtl');
    configuredDirection = direction;
  }
}

/** SDK 57 application reload; it keeps the currently running JS bundle. */
export function reloadLanguageApplication(reason: string): Promise<void> {
  return Expo.reloadAppAsync(reason);
}
