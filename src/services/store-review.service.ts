import * as StoreReview from 'expo-store-review';

import { openExternalUrl } from '@/utils/external-links';

/**
 * The rating itself only ever lives on the store: neither App Store Connect nor
 * Google Play exposes an API that accepts a star count from inside the app, so
 * everything here is about handing the player to the native review flow — the
 * one place where a rating they submit is actually recorded.
 */
export async function isStoreReviewSupported(): Promise<boolean> {
  try {
    return await StoreReview.hasAction();
  } catch {
    return false;
  }
}

/**
 * Asks the platform for its in-app review sheet and falls back to the store
 * listing when the sheet is unavailable (TestFlight builds, Android below 5.0,
 * or a device without the Play Store).
 *
 * A resolved promise means the flow was handed over, not that a review was
 * left — the stores deliberately keep that outcome private, and they silently
 * skip the sheet once a player has been asked too often.
 */
export async function openStoreReview(): Promise<boolean> {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return true;
    }
  } catch {
    // Falls through to the store listing below.
  }

  const listingUrl = StoreReview.storeUrl();

  return listingUrl ? openExternalUrl(listingUrl) : false;
}
