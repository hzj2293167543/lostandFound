import { AxiosRequestConfig } from 'axios';
import { get, post, remove } from '../client';
import { CommentCreateDto, CommentItem, Count, PageResponse } from '@lostfound/shared';

export const commentApi = {
  getCommentsByItem: (itemId: number, itemType: number) =>
    get<CommentItem[]>('/comments', { params: { itemId, itemType } }),

  getCommentsByUserId: (userId: number, page?: number, limit?: number) =>
    get<PageResponse<CommentItem>>(`/comments/user/${userId}`, {
      params: { page, limit },
    }),

  getCommentsByUserIdCount: (userId: number) => get<Count>(`/comments/user/${userId}/count`),

  likeComment: (id: number, isLiked: boolean) =>
    post<void>(`/comments/${id}/like`, null, { params: { isLiked } }),

  createComment: (data: CommentCreateDto, config?: AxiosRequestConfig) =>
    post<CommentItem>('/comments', data, config),

  deleteComment: (id: number) => remove<void>(`/comments/${id}`),
};

export default commentApi;
