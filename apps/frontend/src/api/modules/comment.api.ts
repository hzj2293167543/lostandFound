import { AxiosRequestConfig } from 'axios';
import { get, post, remove } from '../client';
import { CommentCreateDto, CommentItem } from '@lostfound/shared';

export const commentApi = {
  getCommentsByItem: (itemId: number, itemType: number) =>
    get<CommentItem[]>('/comments', { params: { itemId, itemType } }),

  getCommentsByUserId: (userId: number) => get<CommentItem[]>(`/comments/user/${userId}`),

  likeComment: (id: number, isLiked: boolean) =>
    post<void>(`/comments/${id}/like`, null, { params: { isLiked } }),

  createComment: (data: CommentCreateDto, config?: AxiosRequestConfig) =>
    post<CommentItem>('/comments', data, config),

  deleteComment: (id: number) => remove<void>(`/comments/${id}`),
};

export default commentApi;
