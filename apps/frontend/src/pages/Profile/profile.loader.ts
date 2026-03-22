import { foundApi, lostApi, userApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { foundKeys, lostKeys, userKeys } from '@/queryKeys';
import { useAuthStore } from '@/stores/AuthStore';

export default async function profileLoader({ params }: { params: { id?: number } }) {
  try {
    const user = useAuthStore.getState().user;
    const id = Number(params.id) || user?.id;
    if (!id) {
      throw new Response('User not found', { status: 404 });
    }
    // 并行确保所有数据都在缓存中
    const [userResult, lostItemsCount, foundItemsCount] = await Promise.all([
      params.id && Number(params.id) !== user?.id
        ? queryClient.ensureQueryData({
            queryKey: userKeys.detail(id),
            queryFn: () => userApi.getUserById(id),
          })
        : Promise.resolve(user),
      queryClient.ensureQueryData({
        queryKey: lostKeys.list(id),
        queryFn: () => lostApi.getLostItemsByUserIdCount(id),
      }),
      queryClient.ensureQueryData({
        queryKey: foundKeys.list(id),
        queryFn: () => foundApi.getFoundItemsByUserIdCount(id),
      }),
    ]);
    return {
      user: userResult,
      lostItemsCount,
      foundItemsCount,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
