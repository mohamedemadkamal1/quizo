import { isAxiosError } from 'axios';

type ApiErrorResponse = {
  message?: unknown;
};

const SAFE_USER_MESSAGE_STATUSES = new Set([400, 409, 422, 429]);
const TECHNICAL_MESSAGE_PATTERN =
  /(?:exception|stack\s*trace|sqlstate|syntaxerror|typeerror|referenceerror|\n\s*at\s)/i;

function normalizeSafeUserMessage(value: unknown): string | null {
  const candidates = Array.isArray(value) ? value : [value];
  const messages = candidates
    .filter((candidate): candidate is string => typeof candidate === 'string')
    .map((candidate) => candidate.trim())
    .filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  const message = messages.join(' ');

  if (
    message.length > 300 ||
    TECHNICAL_MESSAGE_PATTERN.test(message) ||
    /<\/?(?:html|body|script)\b/i.test(message)
  ) {
    return null;
  }

  return message;
}

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
    return normalizeSafeUserMessage(error.response?.data?.message) ?? fallback;
  }

  return fallback;
}

/**
 * Support accepts backend validation and rate-limit copy only for statuses
 * where the response is intended for the person filling in the form. Network
 * failures, authentication failures and server errors always use translated
 * app copy, so internal diagnostics can never leak into the modal.
 */
export function getSafeSupportErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const status = error.response?.status;

  if (!status || !SAFE_USER_MESSAGE_STATUSES.has(status)) {
    return fallback;
  }

  return normalizeSafeUserMessage(error.response?.data?.message) ?? fallback;
}
