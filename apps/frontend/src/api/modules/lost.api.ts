import {
  Count,
  GetLostItemsParams,
  LostCreateDto,
  LostDetail,
  LostItem,
  LostUpdateDto,
  PageResponse,
} from '@lostfound/shared';
import { AxiosRequestConfig } from 'axios';
import { get, patch, post, remove } from '../client';

export const lostApi = {
  getLostItems: (params?: GetLostItemsParams) =>
    get<PageResponse<LostItem>>('/lost-items', { params }),

  getLostItemsAll: () => get<LostItem[]>('/lost-items/all'),

  getLostItemsTop: (count?: number) =>
    get<LostItem[]>('/lost-items/top', {
      params: count === undefined ? undefined : { limit: count },
    }),

  getLostItemsTop3: () => lostApi.getLostItemsTop(3),

  getLostItemDetailById: (id: number, config?: AxiosRequestConfig) =>
    get<LostDetail>(`/lost-items/${id}`, config),

  getLostItemsByUserId: (userId: number, page?: number, limit?: number) =>
    get<PageResponse<LostItem>>(`/lost-items/user/${userId}`, {
      params: { page, limit },
    }),

  getLostItemsByUserIdCount: (userId: number) => get<Count>(`/lost-items/user/${userId}/count`),

  createLost: (data: LostCreateDto, config?: AxiosRequestConfig) =>
    post<LostCreateDto>('/lost-items', data, config),

  updateLostItem: (data: LostUpdateDto) => patch<LostItem>(`/lost-items/`, data),
  deleteLostItem: (id: number) => remove<void>(`/lost-items/${id}`),
};

export default lostApi;
