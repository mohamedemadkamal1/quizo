import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { getLeaderboardMetrics } from '@/constants/leaderboard';
import { getProfileAvatar } from '@/constants/profile-avatars';
import { useTranslation } from '@/hooks/useTranslation';
import type { Translate } from '@/i18n';
import {
  getLeaderboard,
  getLeaderboardQueryKey,
  LEADERBOARD_FIRST_PAGE,
  LEADERBOARD_LIMIT,
} from '@/services/leaderboard.service';
import { useAuthStore } from '@/store/auth.store';
import type {
  LeaderboardItemDto,
  LeaderboardPage,
  LeaderboardPodiumEntry,
  LeaderboardPodiumPlace,
  LeaderboardRankedEntry,
} from '@/types/leaderboard.types';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { getProfileInitials } from '@/utils/profile';

const EMPTY_PAGES: LeaderboardPage[] = [];
const PODIUM_SIZE = 3;

type SessionUser = {
  id: string | undefined;
  username: string | null | undefined;
};

/**
 * The leaderboard username first, then the signed-in player's own username for
 * their own row, and a neutral placeholder otherwise. The email the backend
 * returns is never part of this: it is dropped at the service boundary.
 */
function resolveDisplayName(
  item: LeaderboardItemDto,
  session: SessionUser,
  t: Translate,
) {
  const username = item.username?.trim();

  if (username) {
    return username;
  }

  if (session.id !== undefined && String(item.id) === session.id) {
    const sessionUsername = session.username?.trim();

    if (sessionUsername) {
      return sessionUsername;
    }
  }

  return t('leaderboard.playerFallback', { id: item.id });
}

function toRankedEntry(
  item: LeaderboardItemDto,
  rank: number,
  session: SessionUser,
  t: Translate,
): LeaderboardRankedEntry {
  const displayName = resolveDisplayName(item, session, t);

  return {
    id: item.id,
    rank,
    displayName,
    totalScore: item.totalScore,
    avatar: item.avatar,
    initials: getProfileInitials(displayName),
    avatarSource: getProfileAvatar(item.avatar)?.source ?? null,
    accessibilityLabel: t('leaderboard.rowLabel', {
      rank,
      name: displayName,
      points: t('leaderboard.points', { count: item.totalScore }),
    }),
  };
}

export function useLeaderboardScreen(contentBottomPadding: number) {
  const { t, language } = useTranslation();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const sessionUserId = useAuthStore((state) => state.session?.user.id);
  const sessionUsername = useAuthStore(
    (state) => state.session?.user.displayName,
  );
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [refreshErrorMessage, setRefreshErrorMessage] = useState<string | null>(
    null,
  );
  const hasFocusedOnceRef = useRef(false);
  const hasScrolledRef = useRef(false);

  const queryKey = getLeaderboardQueryKey(sessionUserId, language);
  const leaderboardQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      getLeaderboard({ page: pageParam, limit: LEADERBOARD_LIMIT }),
    initialPageParam: LEADERBOARD_FIRST_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(sessionUserId),
    refetchOnWindowFocus: false,
  });

  const { fetchNextPage, refetch } = leaderboardQuery;
  const pages = leaderboardQuery.data?.pages ?? EMPTY_PAGES;

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnceRef.current) {
        void refetch({ cancelRefetch: false });
      } else {
        hasFocusedOnceRef.current = true;
      }
    }, [refetch]),
  );

  // Ranking follows the backend order exactly. The only client-side change is
  // dropping an id a later page repeated, keeping its first occurrence, so the
  // combined pages never render the same player twice.
  const entries = useMemo(() => {
    const session: SessionUser = {
      id: sessionUserId,
      username: sessionUsername,
    };
    const seenIds = new Set<number>();
    const ranked: LeaderboardRankedEntry[] = [];

    for (const page of pages) {
      for (const item of page.items) {
        if (seenIds.has(item.id)) {
          continue;
        }

        seenIds.add(item.id);
        ranked.push(toRankedEntry(item, ranked.length + 1, session, t));
      }
    }

    return ranked;
  }, [pages, sessionUserId, sessionUsername, t]);

  const podiumEntries = useMemo<LeaderboardPodiumEntry[]>(
    () =>
      entries.slice(0, PODIUM_SIZE).map((entry) => ({
        ...entry,
        place: entry.rank as LeaderboardPodiumPlace,
      })),
    [entries],
  );

  const metrics = useMemo(() => getLeaderboardMetrics(width), [width]);

  // FlatList reports `onEndReached` during its first layout pass, before any
  // cell has been measured, which would fetch page two the moment the tab
  // opens. Pagination therefore stays closed until the list is actually
  // dragged.
  const markListScrolled = useCallback(() => {
    hasScrolledRef.current = true;
  }, []);

  const loadMore = useCallback(() => {
    if (
      !hasScrolledRef.current ||
      !leaderboardQuery.hasNextPage ||
      leaderboardQuery.isFetchingNextPage ||
      // A failed page waits for the inline retry instead of firing again on
      // every scroll event.
      leaderboardQuery.isFetchNextPageError ||
      isPullRefreshing
    ) {
      return;
    }

    void fetchNextPage();
  }, [
    fetchNextPage,
    isPullRefreshing,
    leaderboardQuery.hasNextPage,
    leaderboardQuery.isFetchNextPageError,
    leaderboardQuery.isFetchingNextPage,
  ]);

  const retryNextPage = useCallback(() => {
    if (leaderboardQuery.isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, leaderboardQuery.isFetchingNextPage]);

  /**
   * Reloads page one with a single request and only replaces the cache once it
   * succeeds, so the current list stays on screen while refreshing and a failed
   * refresh leaves the loaded results untouched.
   */
  const refresh = useCallback(async () => {
    if (isPullRefreshing) {
      return;
    }

    setIsPullRefreshing(true);
    setRefreshErrorMessage(null);

    try {
      const firstPage = await getLeaderboard({
        page: LEADERBOARD_FIRST_PAGE,
        limit: LEADERBOARD_LIMIT,
      });

      queryClient.setQueryData<InfiniteData<LeaderboardPage, number>>(
        queryKey,
        { pages: [firstPage], pageParams: [LEADERBOARD_FIRST_PAGE] },
      );
      hasScrolledRef.current = false;
    } catch (error) {
      setRefreshErrorMessage(
        getApiErrorMessage(error, t('leaderboard.refreshErrorFallback')),
      );
    } finally {
      setIsPullRefreshing(false);
    }
  }, [isPullRefreshing, queryClient, queryKey, t]);

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const hasData = leaderboardQuery.data !== undefined;
  const nextPageErrorMessage = leaderboardQuery.isFetchNextPageError
    ? getApiErrorMessage(
        leaderboardQuery.error,
        t('leaderboard.nextPageErrorFallback'),
      )
    : null;

  return {
    metrics,
    entries,
    podiumEntries,
    isInitialLoading:
      (leaderboardQuery.isPending || !sessionUserId) && !hasData,
    isInitialError: leaderboardQuery.isError && !hasData,
    isEmpty: hasData && entries.length === 0,
    errorMessage: leaderboardQuery.isError
      ? getApiErrorMessage(
          leaderboardQuery.error,
          t('leaderboard.errorFallback'),
        )
      : null,
    isRefreshing: isPullRefreshing,
    isRetrying:
      leaderboardQuery.isFetching && !leaderboardQuery.isFetchingNextPage,
    isLoadingNextPage: leaderboardQuery.isFetchingNextPage,
    // One inline slot in the footer covers both non-destructive failures: a
    // page that could not be appended and a refresh that could not replace.
    footerErrorMessage: nextPageErrorMessage ?? refreshErrorMessage,
    footerActionLabel: nextPageErrorMessage
      ? t('leaderboard.loadMore')
      : t('common.tryAgain'),
    retryFooterAction: nextPageErrorMessage
      ? retryNextPage
      : () => void refresh(),
    loadMore,
    markListScrolled,
    refresh,
    retry,
    contentBottomPadding,
  };
}
