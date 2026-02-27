import { categoryApi, lostApi } from '@/api';

export async function lostLoader() {
  try {
    // 并行获取数据
    const [lostData, categoryData] = await Promise.all([
      lostApi.getLostItems(),
      categoryApi.getCategories(),
    ]);

    return {
      lostItems: lostData,
      categories: categoryData,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
