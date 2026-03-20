import { categoryApi, lostApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { lostKeys } from '@/queryKeys';
import { categoryKeys } from '@/queryKeys';

export async function lostLoader() {
  try {
    // 并行获取数据
    const [lostItems, categories] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: lostKeys.lists(),
        queryFn: () => lostApi.getLostItems(),
      }),
      queryClient.ensureQueryData({
        queryKey: categoryKeys.list(),
        queryFn: () => categoryApi.getCategories(),
      }),
    ]);
    return {
      lostItems,
      categories,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
