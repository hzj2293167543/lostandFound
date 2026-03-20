import { categoryApi, foundApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { foundKeys } from '@/queryKeys';
import { categoryKeys } from '@/queryKeys';

export async function foundLoader() {
  try {
    const [foundItems, categories] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: foundKeys.lists(),
        queryFn: () => foundApi.getFoundItems(),
      }),
      queryClient.ensureQueryData({
        queryKey: categoryKeys.list(),
        queryFn: () => categoryApi.getCategories(),
      }),
    ]);
    return {
      foundItems,
      categories,
    };
  } catch (error) {
    console.error('Error loading found items:', error);
    throw new Response('Failed to load found items', { status: 500 });
  }
}
