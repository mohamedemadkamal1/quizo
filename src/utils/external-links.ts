import * as Linking from 'expo-linking';

export const SUPPORT_EMAIL_URL = 'mailto:support@quizo.games';
export const TERMS_URL = 'https://quizo.amer-group.com/terms';

/**
 * Opens a system-owned destination without allowing a missing handler or a
 * cancelled system prompt to surface as an unhandled rejection.
 */
export async function openExternalUrl(url: string): Promise<boolean> {
  try {
    if (!(await Linking.canOpenURL(url))) {
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
