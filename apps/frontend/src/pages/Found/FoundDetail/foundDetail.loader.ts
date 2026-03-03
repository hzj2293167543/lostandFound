import { categoryApi, foundApi } from '@/api';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function foundDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    if (!id) {
      throw new Response('Missing ID', { status: 400 });
    }
    const [foundItem, categories] = await Promise.all([
      foundApi.getFoundItemDetailById(id),
      categoryApi.getCategories(),
    ]);
    return { foundItem, categories };
  } catch (error) {
    console.error('Error loading found item details:', error);
    throw new Response('Failed to load found item details', { status: 500 });
  }
}
