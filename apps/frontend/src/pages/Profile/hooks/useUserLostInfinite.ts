import { lostApi } from '@/api';
import { lostKeys } from '@/queryKeys';
import { LostItem, PageResponse } from '@lostfound/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import type { UIEvent } from 'react';
export function useUserLostInfinite(userId: number, isSelf: boolean) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, status } =
    useInfiniteQuery<PageResponse<LostItem>>({
      queryKey: lostKeys.userLostList(userId),
      queryFn: ({ pageParam = 1 }) => lostApi.getLostItemsByUserId(userId, pageParam as number, 10),
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
    const dataRows = allItems.length;
    const loaderRow = hasNextPage || isFetchingNextPage ? 1 : 0;
    return dataRows + loaderRow;
  }, [allItems.length, hasNextPage, isFetchingNextPage]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const bottom = scrollHeight - scrollTop - clientHeight;
    if (bottom < 300 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const itemData = useMemo(
    () => ({
      items: allItems,
      hasNextPage,
      isFetchingNextPage,
      isSelf,
      fetchNextPage,
    }),
    [allItems, hasNextPage, isFetchingNextPage, fetchNextPage, isSelf]
  );

  return {
    parentRef,
    isFetching,
    status,
    rowCount,
    itemData,
    handleScroll,
  };
}
