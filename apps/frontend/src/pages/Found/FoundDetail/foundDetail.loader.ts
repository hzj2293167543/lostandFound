import { categoryApi, commentApi, foundApi } from '@/api';
import { ItemTypeMap } from '@/types/type';
import { LoaderFunctionArgs } from 'react-router-dom';
import { Comment } from '@lostfound/shared';
import { buildTree } from '@/utils';

export async function foundDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    if (!id) {
      throw new Response('Missing ID', { status: 400 });
    }
    const [foundDetail, commentsDto, categories] = await Promise.all([
      foundApi.getFoundItemDetailById(id),
      commentApi.getCommentsByItem(id, ItemTypeMap.FOUND),
      categoryApi.getCategories(),
    ]);

    const comments: Comment[] = buildTree(commentsDto);

    return {
      foundDetail,
      comments,
      categories,
    };
  } catch (error) {
    console.error('Error fetching found item detail:', error);
    throw new Response('Failed to load found items', { status: 500 });
  }
}
