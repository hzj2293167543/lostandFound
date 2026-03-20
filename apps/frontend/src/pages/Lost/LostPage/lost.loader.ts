import { categoryApi, lostApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { lostKeys } from '@/queryKeys';
import { categoryKeys } from '@/queryKeys';

export async function lostLoader() {
  try {
    const categories = await queryClient.ensureQueryData({
      queryKey: categoryKeys.list(),
      queryFn: () => categoryApi.getCategories(),
    });
    return {
      categories,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
