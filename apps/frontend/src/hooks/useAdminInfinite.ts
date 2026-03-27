import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { adminApi } from '@/api';
import { adminKeys } from '@/keys/admin';
import { LostItem, PageResponse, User } from '@lostfound/shared';
const PAGE_SIZE = 20;
export function useAdminInfiniteUsers(pageSize: number = PAGE_SIZE) {
  return useInfiniteQuery<PageResponse<User & { deletedAt?: Date }>>({
    queryKey: adminKeys.usersInfinite(),
    queryFn: ({ pageParam }) => adminApi.getUsersPaginated(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function useAdminInfiniteLostItems(pageSize: number = PAGE_SIZE) {
  return useInfiniteQuery<PageResponse<LostItem>>({
    queryKey: adminKeys.lostInfinite(),
    queryFn: ({ pageParam }) => adminApi.getLostItemsPaginated(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function useAdminInfiniteFoundItems(pageSize: number = PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: adminKeys.foundInfinite(),
    queryFn: ({ pageParam }) => adminApi.getFoundItemsPaginated(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function useAdminInfiniteAnnouncements(pageSize: number = PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: adminKeys.announcementsInfinite(),
    queryFn: ({ pageParam }) => adminApi.getAnnouncementsPaginated(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}
