import { AxiosRequestConfig } from 'axios';
import { get, post, put, remove } from '../client';
import { LostItem, LostDetail } from '@lostfound/schema';

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

  createLostItem: (data: Partial<LostItem>) => post<LostItem>('/lost-items', data),

  updateLostItem: (id: number, data: Partial<LostItem>) => put<LostItem>(`/lost-items/${id}`, data),
  deleteLostItem: (id: number) => remove<void>(`/lost-items/${id}`),
};

export default lostApi;
