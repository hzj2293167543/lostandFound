import { useEffect, useState } from 'react';

import { LostItem } from '@lostfound/schema';
import { lostApi } from '@/api';

export function useLostData() {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const lostData = await lostApi.getLostItems();
        setLostItems(lostData);
      } catch (error) {
        console.error('获取失物数据失败:', error);
      }
    };
    fetchLostItems();
  }, []);
  return { lostItems };
}
