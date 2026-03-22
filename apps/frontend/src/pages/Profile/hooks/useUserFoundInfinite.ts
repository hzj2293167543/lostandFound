import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useMemo } from 'react';
import { foundApi } from '@/api';
import { foundKeys } from '@/queryKeys';
import { FoundItem, PageResponse } from '@lostfound/shared';

export function useUserFoundInfinite(userId: number, isSelf: boolean) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, status } =
    useInfiniteQuery<PageResponse<FoundItem>>({
      queryKey: foundKeys.userFoundList(userId),
      queryFn: ({ pageParam = 1 }) =>
        foundApi.getFoundItemsByUserId(userId, pageParam as number, 10),
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

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
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
      fetchNextPage,
      isSelf,
    }),
    [allItems, hasNextPage, isFetchingNextPage, fetchNextPage, isSelf]
  );

  return {
    parentRef,
    allItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    rowCount,
    itemData,
    handleScroll,
  };
}
