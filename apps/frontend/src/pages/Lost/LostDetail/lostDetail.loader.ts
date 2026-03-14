import { categoryApi, commentApi, lostApi } from '@/api';
import { ItemTypeMap } from '@/types/type';
import { LoaderFunctionArgs } from 'react-router-dom';
import { Comment } from '@lostfound/shared';
import { buildTree } from '@/utils';

export async function lostDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    if (!id) {
      throw new Response('Missing ID', { status: 400 });
    }
    const [lostDetail, commentsDto, categories] = await Promise.all([
      lostApi.getLostItemDetailById(id),
      commentApi.getCommentsByItem(id, ItemTypeMap.LOST),
      categoryApi.getCategories(),
    ]);

    const comments: Comment[] = buildTree(commentsDto);

    return {
      lostDetail,
      comments,
      categories,
    };
  } catch (error) {
    console.error('Error fetching lost item detail:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
