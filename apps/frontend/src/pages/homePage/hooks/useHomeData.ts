// hooks/useHomeData.ts
import { useState, useEffect } from 'react';
import { Announcement, FoundItem, LostItem } from '@lostfound/schema';
import { announcementApi, foundApi, lostApi } from '@/api';

export function useHomeData() {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 三个 fetch 并行或串行，这里保持原样
        const [lostData, foundData, annData] = await Promise.all([
          lostApi.getLostItemsTop3(),
          foundApi.getFoundItemsTop3(),
          announcementApi.getAnnouncementsTop3(),
        ]);
        setLostItems(lostData);
        setFoundItems(foundData);
        setAnnouncements(annData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { lostItems, foundItems, announcements, loading };
}
