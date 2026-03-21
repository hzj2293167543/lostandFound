import { categoryApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { categoryKeys } from '@/queryKeys';

export async function announcementsLoader() {
  try {
    const categories = await queryClient.ensureQueryData({
      queryKey: categoryKeys.list(),
      queryFn: () => categoryApi.getCategories(),
    });
    return {
      categories,
    };
  } catch (error) {
    console.error('Error fetching announcements data:', error);
    throw error;
  }
}
