import { useInfiniteQuery } from '@tanstack/react-query';
import { lostApi } from '@/api';
import { lostKeys } from '@/queryKeys';
import { PageResponse, LostItem, GetLostItemsParams } from '@lostfound/shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LOAD_MORE_THRESHOLD = 300; // 滚动到底部提前加载的阈值（px）

export function useLostInfiniteQuery(filters?: GetLostItemsParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  // 容器宽度改为 state，以便响应窗口 resize 时重新渲染
  const [containerWidth, setContainerWidth] = useState(1450);

  // 监听容器宽度变化
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 根据容器宽度动态计算列数（响应式布局）
  const columnCount = useMemo(() => {
    const width = containerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }, [containerWidth]);

  // 动态列宽：平均分配容器宽度
  const columnWidth = useMemo(() => {
    return containerWidth / columnCount;
  }, [containerWidth, columnCount]);

  // 无限滚动查询
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<
    PageResponse<LostItem>
  >({
    queryKey: lostKeys.infinite(filters as Record<string, unknown>),
    queryFn: ({ pageParam = 1 }) => lostApi.getLostItems({ page: pageParam as number, ...filters }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return null;
    },
    initialPageParam: 1,
  });

  // 所有已加载的数据（平铺）
  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // 总行数：实际数据行数 + 可能存在的加载更多提示行
  const rowCount = useMemo(() => {
    const dataRows = Math.ceil(allItems.length / columnCount);
    const loaderRow = hasNextPage || isFetchingNextPage ? 1 : 0;
    return dataRows + loaderRow;
  }, [allItems.length, columnCount, hasNextPage, isFetchingNextPage]);

  // 滚动事件处理，判断是否需要加载更多
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

      if (
        scrollHeight - scrollTop - clientHeight < LOAD_MORE_THRESHOLD &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // 传递给 Grid 的额外数据，方便 Cell 使用
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
  };
}
