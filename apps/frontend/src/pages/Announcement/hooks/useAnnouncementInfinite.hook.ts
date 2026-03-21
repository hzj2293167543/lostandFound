import { useInfiniteQuery } from '@tanstack/react-query';
import { announcementApi } from '@/api';
import { announcementKeys } from '@/queryKeys';
import { debounce, Announcement, PageResponse, GetAnnouncementsParams } from '@lostfound/shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useAnnouncementInfinite(filters?: GetAnnouncementsParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateSize = debounce(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    }, 200);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<
    PageResponse<Announcement>
  >({
    queryKey: announcementKeys.infinite(filters as Record<string, unknown>),
    queryFn: ({ pageParam = 1 }) =>
      announcementApi.getAnnouncements({
        page: pageParam as number,
        limit: 6,
        ...filters,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return null;
    },
    initialPageParam: 1,
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
    (event: React.UIEvent<HTMLDivElement>) => {
      if (containerHeight === null) return;
      const { scrollTop } = event.target as HTMLDivElement;
      const scrollHeight = allItems.length * 220;
      const clientHeight = containerHeight;
      const bottom = scrollHeight - scrollTop - clientHeight;
      if (bottom < 300 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage, containerHeight, allItems.length]
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
    containerHeight,
    containerWidth,
    containerRef,
    allItems,
  };
}
