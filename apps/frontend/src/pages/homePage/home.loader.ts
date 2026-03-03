import { announcementApi, foundApi, lostApi } from '@/api';

export async function homeLoader() {
  try {
    // 并行获取数据
    const [lostData, foundData, annData] = await Promise.all([
      lostApi.getLostItemsTop3(),
      foundApi.getFoundItemsTop3(),
      announcementApi.getAnnouncementsTop3(),
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
