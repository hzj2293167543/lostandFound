import { useInfiniteQuery } from '@tanstack/react-query';
import { commentApi } from '@/api';
import { commentKeys } from '@/queryKeys/comment.key';
import { CommentItem, PageResponse } from '@lostfound/shared';

const PAGE_SIZE = 10;

export function useItemCommentInfinite(itemId: number, itemType: number) {
  return useInfiniteQuery<PageResponse<CommentItem>>({
    queryKey: commentKeys.itemComments(itemId, itemType),
    queryFn: ({ pageParam }) =>
      commentApi.getCommentsByItemPaginated(itemId, itemType, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}
