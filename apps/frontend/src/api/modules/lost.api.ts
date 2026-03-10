import { AxiosRequestConfig } from 'axios';
import { get, post, put, remove } from '../client';
import { LostItem, LostDetail, LostCreateDto } from '@lostfound/shared';

export const lostApi = {
  getLostItems: () => get<LostItem[]>('/lost-items'),

  getLostItemsTop: (count?: number) =>
    get<LostItem[]>('/lost-items/top', {
      params: count === undefined ? undefined : { limit: count },
    }),

  getLostItemsTop3: () => lostApi.getLostItemsTop(3),

  getLostItemDetailById: (id: number, config?: AxiosRequestConfig) =>
    get<LostDetail>(`/lost-items/${id}`, config),

  getLostItemsByUserId: (userId: number) => get<LostItem[]>(`/lost-items/user/${userId}`),

  createLost: (data: LostCreateDto, config?: AxiosRequestConfig) =>
    post<LostCreateDto>('/lost-items', data, config),

  updateLostItem: (id: number, data: LostItem) => put<LostItem>(`/lost-items/${id}`, data),
  deleteLostItem: (id: number) => remove<void>(`/lost-items/${id}`),
};

export default lostApi;
