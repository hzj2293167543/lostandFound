import { get, post, remove } from '../client';
import { Comment } from '@lostfound/schema';

export const commentApi = {
  getCommentsByItem: (itemId: number, itemType: number) =>
    get<Comment[]>('/comments', { params: { itemId, itemType } }),

  getCommentsByUserId: (userId: number) => get<Comment[]>(`/comments/user/${userId}`),

  createComment: (data: { content: string; itemId: number; itemType: number }) =>
    post<Comment>('/comments', data),

  deleteComment: (id: number) => remove<void>(`/comments/${id}`),
};

export default commentApi;
