import { AxiosRequestConfig } from 'axios';
import { get, patch, post, put, remove } from '../client';
import {
  AdminStats,
  User,
  Category,
  Announcement,
  LostItem,
  FoundItem,
  AnnouncementCreateDto,
  AnnouncementEditDto,
} from '@lostfound/shared';

interface RecentItem {
  id: number;
  title: string;
  time: string;
}

export const adminApi = {
  getStats: (config?: AxiosRequestConfig) => get<AdminStats>('/admin/stats', config),

  getRecentLostItems: (config?: AxiosRequestConfig) =>
    get<RecentItem[]>('/admin/lost/recent', config),

  getRecentFoundItems: (config?: AxiosRequestConfig) =>
    get<RecentItem[]>('/admin/found/recent', config),

  getAllUsers: (config?: AxiosRequestConfig) => get<User[]>('/admin/users', config),

  updateUserStatus: (userId: number, status: number) =>
    put<User>(`/admin/users/${userId}/status`, { status }),

  getAllLostItems: (config?: AxiosRequestConfig) => get<LostItem[]>('/admin/lost', config),

  deleteLostItem: (id: number) => remove<void>(`/admin/lost/${id}`),

  getAllFoundItems: (config?: AxiosRequestConfig) => get<FoundItem[]>('/admin/found', config),

  deleteFoundItem: (id: number) => remove<void>(`/admin/found/${id}`),

  getAllCategories: (config?: AxiosRequestConfig) => get<Category[]>('/admin/categories', config),

  createCategory: (name: string) => post<Category>('/admin/categories', { name }),

  updateCategory: (id: number, name: string) => put<Category>(`/admin/categories/${id}`, { name }),

  deleteCategory: (id: number) => remove<void>(`/admin/categories/${id}`),

  getAllAnnouncements: (config?: AxiosRequestConfig) =>
    get<Announcement[]>('/admin/announcements', config),

  createAnnouncement: (data: Partial<AnnouncementCreateDto>) =>
    post<Announcement>('/admin/announcements', data),

  updateAnnouncement: (id: number, data: Partial<AnnouncementEditDto>) =>
    patch<Announcement>(`/admin/announcements/${id}`, data),

  deleteAnnouncement: (id: number) => remove<void>(`/admin/announcements/${id}`),
};

export default adminApi;
