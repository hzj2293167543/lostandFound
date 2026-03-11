import { AxiosRequestConfig } from 'axios';
import { get, post, put, remove } from '../client';
import { FoundItem, FoundDetail, FoundCreateDto } from '@lostfound/shared';

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

  updateFoundItem: (id: number, data: Partial<FoundItem>) =>
    put<FoundItem>(`/found-items/${id}`, data),

  deleteFoundItem: (id: number) => remove<void>(`/found-items/${id}`),
};

export default foundApi;
