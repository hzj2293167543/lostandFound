import { announcementApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { announcementKeys } from '@/queryKeys';

export async function announcementsLoader() {
  try {
    // 并行获取数据
    const annData = await queryClient.ensureQueryData({
      queryKey: announcementKeys.list(),
      queryFn: () => announcementApi.getAnnouncements(),
    });
    return {
      announcements: annData,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
}
