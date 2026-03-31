import { announcementApi } from '@/api';
import { announcementKeys } from '@/queryKeys';
import { Announcement, GetAnnouncementsParams, PageResponse } from '@lostfound/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';
import type { UIEvent } from 'react';

const PAGE_NUM = 6;
export function useAnnouncementInfinite(filters?: GetAnnouncementsParams) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, status } =
    useInfiniteQuery<PageResponse<Announcement>>({
      queryKey: announcementKeys.infinite(filters as Record<string, unknown>),
      queryFn: ({ pageParam = 1 }) =>
        announcementApi.getAnnouncements({
          page: pageParam as number,
          limit: PAGE_NUM,
          ...filters,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return null;
      },
      initialPageParam: 1,
      placeholderData: (previousData) => previousData,
    });

  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const rowCount = useMemo(() => {
    const dataRows = allItems.length;
    const loaderRow = hasNextPage || isFetchingNextPage ? 1 : 0;
    return dataRows + loaderRow;
  }, [allItems.length, hasNextPage, isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = event.target as HTMLDivElement;
      const bottom = scrollHeight - scrollTop - clientHeight;
      if (bottom < 300 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const itemData = useMemo(
    () => ({
      items: allItems,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    }),
    [allItems, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return {
    itemData,
    handleScroll,
    status,
    rowCount,
    containerRef,
    allItems,
    isFetching,
  };
}
