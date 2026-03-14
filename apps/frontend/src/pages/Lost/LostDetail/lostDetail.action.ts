import { commentApi } from '@/api';
import { mapLostDetailFormToCommentDto } from '@/mappers/lost.mappers';
import { commentCreateDtoSchema } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';
import { LOST_DETAIL_INTENT } from '../type';

export const lostDetailAction: ActionFunction = async ({ request }) => {
  let intent;
  try {
    let result;
    const formData = await request.formData();
    intent = formData.get('intent') ? Number(formData.get('intent')) : -1;
    if (!Object.values(LOST_DETAIL_INTENT).includes(intent)) {
      throw new Response('无效的操作', { status: 400 });
    }

    if (intent === LOST_DETAIL_INTENT.COMMENT) {
      const comment = mapLostDetailFormToCommentDto(formData);

      const validatedComment = commentCreateDtoSchema.safeParse(comment);
      if (!validatedComment.success) {
        throw new Response('评论内容无效', { status: 400 });
      }
      result = await commentApi.createComment(validatedComment.data);
    }
    // const id = formData.get('id') as string;
    // const comment = [{
    //   id: Number(id),
    //   parentId: Number(formData.get('parentId')),
    //   itemId: Number(formData.get('itemId')),
    //   itemType: Number(formData.get('itemType')),
    //   userId: Number(formData.get('userId')),
    //   description: formData.get('description') as string,
    //   time: new Date().toISOString(),
    //   comments: [comment],
    // }];

    // const result = await lostApi.getLostItemDetailById(Number(id));
    return { success: true, result };
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (intent === LOST_DETAIL_INTENT.COMMENT) {
      errorMessage = '创建评论失败';
    }
    return { success: false, error: errorMessage };
  }
};
