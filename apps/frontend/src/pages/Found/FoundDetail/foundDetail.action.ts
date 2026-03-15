import { commentApi } from '@/api';
import { mapLostDetailFormToCommentDto } from '@/mappers/lost.mappers';
import { commentCreateDtoSchema } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';
import { FOUND_DETAIL_INTENT } from '../type';

export const foundDetailAction: ActionFunction = async ({ request }) => {
  let intent;
  try {
    let result;
    const formData = await request.formData();
    intent = formData.get('intent') ? Number(formData.get('intent')) : -1;
    if (!Object.values(FOUND_DETAIL_INTENT).includes(intent)) {
      throw new Response('无效的操作', { status: 400 });
    }

    if (intent === FOUND_DETAIL_INTENT.COMMENT) {
      const comment = mapLostDetailFormToCommentDto(formData);

      const validatedComment = commentCreateDtoSchema.safeParse(comment);
      if (!validatedComment.success) {
        throw new Response('评论内容无效', { status: 400 });
      }
      result = await commentApi.createComment(validatedComment.data);
    }
    return { success: true, result, intent };
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (intent === FOUND_DETAIL_INTENT.COMMENT) {
      errorMessage = '创建评论失败';
    }
    return { success: false, error: errorMessage };
  }
};
