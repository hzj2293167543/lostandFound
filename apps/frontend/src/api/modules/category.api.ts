import { AxiosRequestConfig } from 'axios';
import { get, post, put, remove } from '../client';
import { Category } from '@lostfound/shared';

export const categoryApi = {
  getCategories: (config?: AxiosRequestConfig) => get<Category[]>('/categories', config),

  getCategoryById: (id: number) => get<Category>(`/categories/${id}`),

  createCategory: (name: string) => post<Category>('/categories', { name }),

  updateCategory: (id: number, name: string) => put<Category>(`/categories/${id}`, { name }),

  deleteCategory: (id: number) => remove<void>(`/categories/${id}`),
};

export default categoryApi;
