import { commentApi } from '@/api';
import { commentCreateDtoSchema } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';
import { FOUND_DETAIL_INTENT } from '../type';
import { getErrorMsg } from '@/utils';
import { queryClient } from '@/lib/queryClient';
import { commentKeys } from '@/queryKeys';
import { ItemTypeMap } from '@/types/type';

export const foundDetailAction: ActionFunction = async ({ request }) => {
  let intent;
  let result;
  try {
    const json = await request.json();
    intent = json.intent;

    if (intent === FOUND_DETAIL_INTENT.COMMENT) {
      const validatedComment = commentCreateDtoSchema.safeParse(json);
      if (!validatedComment.success) {
        throw new Response('评论内容无效', { status: 400 });
      }
      result = await commentApi.createComment(validatedComment.data);
      await queryClient.refetchQueries({
        queryKey: commentKeys.list(validatedComment.data.itemId, { type: ItemTypeMap.FOUND }),
      });
    } else {
      throw new Response('无效的操作', { status: 400 });
    }
    return { success: true, result, intent };
  } catch (error) {
    const errorMessage = getErrorMsg(error, '创建评论失败');
    return { success: false, error: errorMessage, intent };
  }
};
