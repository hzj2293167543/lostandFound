import { categoryApi, lostApi } from '@/api';
import { LoaderFunctionArgs } from 'react-router-dom';
export async function lostDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = params.id;
    if (!id) {
      throw new Response('Missing ID', { status: 400 });
    }
    return await Promise.all([
      lostApi.getLostItemDetailById(Number(id)),
      categoryApi.getCategories(),
    ]);
  } catch (error) {
    console.error('Error fetching lost item detail:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
