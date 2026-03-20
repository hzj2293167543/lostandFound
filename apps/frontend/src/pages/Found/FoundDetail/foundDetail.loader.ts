import { commentApi, foundApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { commentKeys, foundKeys } from '@/queryKeys';
import { ItemTypeMap } from '@/types/type';
import { buildTree } from '@/utils';
import { Comment } from '@lostfound/shared';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function foundDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    if (!id) {
      throw new Response('Missing ID', { status: 400 });
    }
    const [foundDetail, commentsDto] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: foundKeys.detail(id),
        queryFn: () => foundApi.getFoundItemDetailById(id),
      }),
      queryClient.ensureQueryData({
        queryKey: commentKeys.list(id, { type: ItemTypeMap.FOUND }),
        queryFn: () => commentApi.getCommentsByItem(id, ItemTypeMap.FOUND),
      }),
    ]);

    const comments: Comment[] = buildTree(commentsDto);

    return {
      foundDetail,
      comments,
    };
  } catch (error) {
    console.error('Error fetching found item detail:', error);
    throw new Response('Failed to load found items', { status: 500 });
  }
}
