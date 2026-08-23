import { isAxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
};

/**
 * Resolves the message a user should see for a failed request.
 *
 * A backend message is preferred because the API is called with `lng`, so it
 * already arrives in the active language. Anything else — a transport failure
 * or an internal invariant — falls back to the caller's translated copy rather
 * than surfacing an untranslated developer diagnostic.
 */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}
