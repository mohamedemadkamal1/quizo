import { QueryClient } from '@tanstack/react-query';

/**
 * The single React Query cache for the app.
 *
 * It lives outside the React tree so non-component code — the language store,
 * for example — can drop backend content that was fetched in the previous
 * language without reaching for a hook.
 */
export const queryClient = new QueryClient();
