import { CommentItem } from '@lostfound/shared';
import { Comment } from './entities/comment.entity';

export function mapCommentToVo(comment: Comment, isLiked: boolean, likeCount: number): CommentItem {
  return {
    id: comment.id,
    parentId: comment.parentId,
    content: comment.content,
    time: comment.time.toISOString(),
    user: {
      id: comment.userId,
      name: comment.user.name,
      avatar: comment.user.avatar,
    },
    replyUser: comment.parentId
      ? {
          id: comment.parent?.userId,
          name: comment.parent?.user.name,
          avatar: comment.parent?.user.avatar,
        }
      : null,
    isLiked,
    likeCount,
  };
}
