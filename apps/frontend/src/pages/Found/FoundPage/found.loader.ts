import { categoryApi, foundApi } from '@/api';

export async function foundLoader() {
  try {
    // 并行获取数据
    const [foundData, categoryData] = await Promise.all([
      foundApi.getFoundItems(),
      categoryApi.getCategories(),
    ]);
    console.log(foundData, categoryData);

    return {
      foundItems: foundData,
      categories: categoryData,
    };
  } catch (error) {
    console.error('Error loading found items:', error);
    throw new Response('Failed to load found items', { status: 500 });
  }
}
