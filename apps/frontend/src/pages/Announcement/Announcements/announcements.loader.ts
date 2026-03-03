import { announcementApi } from '@/api';

export async function announcementsLoader() {
  try {
    // 并行获取数据
    const annData = await announcementApi.getAnnouncements();
    return {
      announcements: annData,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
}
