import {
  Count,
  FoundCreateDto,
  FoundDetail,
  FoundItem,
  FoundUpdateDto,
  GetFoundItemsParams,
  PageResponse,
} from '@lostfound/shared';
import { AxiosRequestConfig } from 'axios';
import { get, patch, post, remove } from '../client';

export const foundApi = {
  getFoundItems: (params?: GetFoundItemsParams) =>
    get<PageResponse<FoundItem>>('/found-items', { params }),

  getFoundItemsTop: (count?: number) =>
    get<FoundItem[]>('/found-items/top', {
      params: count === undefined ? undefined : { limit: count },
    }),

  getFoundItemsTop3: () => foundApi.getFoundItemsTop(3),

  getFoundItemDetailById: (id: number, config?: AxiosRequestConfig) =>
    get<FoundDetail>(`/found-items/${id}`, config),

  getFoundItemsByUserId: (userId: number, page?: number, limit?: number) =>
    get<PageResponse<FoundItem>>(`/found-items/user/${userId}`, {
      params: { page, limit },
    }),

  getFoundItemsByUserIdCount: (userId: number) => get<Count>(`/found-items/user/${userId}/count`),

  createFoundItem: (data: FoundCreateDto, config?: AxiosRequestConfig) =>
    post<FoundCreateDto>('/found-items', data, config),

  updateFoundItem: (data: FoundUpdateDto) => patch<FoundItem>(`/found-items`, data),

  deleteFoundItem: (id: number) => remove<void>(`/found-items/${id}`),
};

export default foundApi;
