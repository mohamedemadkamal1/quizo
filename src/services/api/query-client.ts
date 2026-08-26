import { QueryClient, type Query } from '@tanstack/react-query';

import { isLocalizedQueryKey } from './localized-query-key.ts';

/**
 * The single React Query cache for the app.
 *
 * It lives outside the React tree so non-component code — the language store,
 * for example — can drop backend content that was fetched in the previous
 * language without reaching for a hook.
 */
export const queryClient = new QueryClient();

function isLocalizedQuery(query: Query): boolean {
  return isLocalizedQueryKey(query.queryKey);
}

/**
 * Cancels in-flight localized reads and marks every language partition stale.
 * Callers deliberately do not await this before a native reload; refetching is
 * deferred until the next runtime mounts observers for the selected language.
 */
export async function markLocalizedQueriesStale(
  client: QueryClient = queryClient,
): Promise<void> {
  await Promise.all([
    client.cancelQueries({ predicate: isLocalizedQuery }),
    client.invalidateQueries({
      predicate: isLocalizedQuery,
      refetchType: 'none',
    }),
  ]);
}
