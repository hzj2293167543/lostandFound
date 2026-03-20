import { commentApi, lostApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { commentKeys, lostKeys } from '@/queryKeys';
import { ItemTypeMap } from '@/types/type';
import { buildTree } from '@/utils';
import { Comment } from '@lostfound/shared';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function lostDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    if (!id) {
      throw new Response('Missing ID', { status: 400 });
    }
    const [lostDetail, commentsDto] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: lostKeys.detail(id),
        queryFn: () => lostApi.getLostItemDetailById(id),
      }),
      queryClient.ensureQueryData({
        queryKey: commentKeys.list(id, { type: ItemTypeMap.LOST }),
        queryFn: () => commentApi.getCommentsByItem(id, ItemTypeMap.LOST),
      }),
    ]);

    const comments: Comment[] = buildTree(commentsDto);

    return {
      lostDetail,
      comments,
    };
  } catch (error) {
    console.error('Error fetching lost item detail:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
