import { AxiosRequestConfig } from 'axios';
import { get, patch, post, put, remove } from '../client';
import { FoundItem, FoundDetail, FoundCreateDto, FoundUpdateDto } from '@lostfound/shared';

export const foundApi = {
  getFoundItems: () => get<FoundItem[]>('/found-items'),

  getFoundItemsTop: (count?: number) =>
    get<FoundItem[]>('/found-items/top', {
      params: count === undefined ? undefined : { limit: count },
    }),

  getFoundItemsTop3: () => foundApi.getFoundItemsTop(3),

  getFoundItemDetailById: (id: number, config?: AxiosRequestConfig) =>
    get<FoundDetail>(`/found-items/${id}`, config),

  getFoundItemsByUserId: (userId: number) => get<FoundItem[]>(`/found-items/user/${userId}`),

  createFoundItem: (data: FoundCreateDto, config?: AxiosRequestConfig) =>
    post<FoundCreateDto>('/found-items', data, config),

  updateFoundItem: (data: FoundUpdateDto) => patch<FoundItem>(`/found-items`, data),

  deleteFoundItem: (id: number) => remove<void>(`/found-items/${id}`),
};

export default foundApi;
