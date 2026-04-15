import { announcementApi, foundApi, lostApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { announcementKeys, foundKeys, lostKeys } from '@/queryKeys';
import { useAuthStore } from '@/stores/AuthStore';
import { ROLE } from '@/stores/type';
import { redirect } from 'react-router-dom';

export async function homeLoader() {
  try {
    const role = useAuthStore.getState().user?.role;
    if (role === ROLE.管理员) return redirect('/admin');

    // 并行获取数据;
    const [lostData, foundData, annData] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: lostKeys.listTop3(),
        queryFn: () => lostApi.getLostItemsTop3(),
        staleTime: 30 * 1000,
      }),
      queryClient.ensureQueryData({
        queryKey: foundKeys.listTop3(),
        queryFn: () => foundApi.getFoundItemsTop3(),
        staleTime: 30 * 1000,
      }),
      queryClient.ensureQueryData({
        queryKey: announcementKeys.listTop3(),
        queryFn: () => announcementApi.getAnnouncementsTop3(),
        staleTime: 30 * 1000,
      }),
    ]);

    return {
      lostItems: lostData,
      foundItems: foundData,
      announcements: annData,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
}
