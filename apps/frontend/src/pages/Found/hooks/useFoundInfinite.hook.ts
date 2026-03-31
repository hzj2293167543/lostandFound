import { useInfiniteQuery } from '@tanstack/react-query';

import { foundApi } from '@/api';
import { foundKeys } from '@/queryKeys';
import { debounce, FoundItem, GetFoundItemsParams, PageResponse } from '@lostfound/shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MD, LG, LOAD_MORE_THRESHOLD } from '@/constants';
import type { UIEvent } from 'react';

export function useFoundInfinite(filters?: GetFoundItemsParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = debounce(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, 200);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const columnCount = useMemo(() => {
    if (!containerWidth) return null;
    const width = containerWidth;
    if (width < MD) return 1;
    if (width < LG) return 2;
    return 3;
  }, [containerWidth]);

  const columnWidth = useMemo(() => {
    if (!containerWidth || !columnCount) return null;
    return containerWidth / columnCount;
  }, [containerWidth, columnCount]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, status } =
    useInfiniteQuery<PageResponse<FoundItem>>({
      queryKey: foundKeys.infinite(filters as Record<string, unknown>),
      queryFn: ({ pageParam = 1 }) =>
        foundApi.getFoundItems({
          page: pageParam as number,
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
    if (!columnCount) return null;
    const dataRows = Math.ceil(allItems.length / columnCount);
    const loaderRow = hasNextPage || isFetchingNextPage ? 1 : 0;
    return dataRows + loaderRow;
  }, [allItems.length, columnCount, hasNextPage, isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const bottom = scrollHeight - scrollTop - clientHeight;
      if (bottom < LOAD_MORE_THRESHOLD && hasNextPage && !isFetchingNextPage) {
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
    columnCount,
    columnWidth,
    containerWidth,
    containerRef,
    allItems,
    isFetching,
  };
}
