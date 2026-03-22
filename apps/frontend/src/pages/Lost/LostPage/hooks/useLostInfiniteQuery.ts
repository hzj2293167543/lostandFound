import { lostApi } from '@/api';
import { lostKeys } from '@/queryKeys';
import { LG, LOAD_MORE_THRESHOLD, MD } from '@/constants/layout';
import { debounce, GetLostItemsParams, LostItem, PageResponse } from '@lostfound/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

export function useLostInfiniteQuery(filters?: GetLostItemsParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }

    const updateWidth = debounce(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    }, 200);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const columnCount = useMemo(() => {
    if (containerWidth === null) return;
    const width = containerWidth;
    if (width < MD) return 1;
    if (width < LG) return 2;
    return 3;
  }, [containerWidth]);

  const columnWidth = useMemo(() => {
    if (containerWidth === null || !columnCount) return null;
    return containerWidth / columnCount;
  }, [containerWidth, columnCount]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, status } =
    useInfiniteQuery<PageResponse<LostItem>>({
      queryKey: lostKeys.infinite(filters as Record<string, unknown>),
      queryFn: ({ pageParam = 1 }) =>
        lostApi.getLostItems({ page: pageParam as number, ...filters }),
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
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const rowCount = useMemo(() => {
    if (!columnCount) return null;
    const dataRows = Math.ceil(allItems.length / columnCount);
    const loaderRow = hasNextPage || isFetchingNextPage ? 1 : 0;
    return dataRows + loaderRow;
  }, [allItems.length, columnCount, hasNextPage, isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const bottom = scrollHeight - scrollTop - clientHeight;
      if (bottom < LOAD_MORE_THRESHOLD && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
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
    containerRef,
    columnCount,
    columnWidth,
    handleScroll,
    containerWidth,
    allItems,
    itemData,
    rowCount,
    status,
    isFetching,
  };
}
