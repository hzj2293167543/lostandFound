import { get, post, put, remove } from './client';
import {
  Category,
  LostItem,
  FoundItem,
  Announcement,
  AnnouncementDetail,
  FoundDetail,
  LostDetail,
} from '@/types';

// 失物相关 API
export const lostApi = {
  // 获取失物列表
  getLostItems: () => get<LostItem[]>('/lost-items'),

  // 获取失物列表（Top 3）
  getLostItemsTop3: () => get<LostItem[]>('/lost-items-top3'),

  // 获取失物详情
  getLostItemDetailById: (id: number) => get<LostDetail>(`/lost-item-detail/${id}`),

  // 创建失物信息
  createLostItem: (data: Omit<LostItem, 'id'>) => post<LostItem>('/lost-items', data),

  // 更新失物信息
  updateLostItem: (id: number, data: Partial<LostItem>) => put<LostItem>(`/lost-items/${id}`, data),

  // 删除失物信息
  deleteLostItem: (id: number) => remove<void>(`/lost-items/${id}`),
};

// 招领相关 API
export const foundApi = {
  // 获取招领列表
  getFoundItems: () => get<FoundItem[]>('/found-items'),

  // 获取招领列表（Top 3）
  getFoundItemsTop3: () => get<FoundItem[]>('/found-items-top3'),

  // 获取招领详情
  getFoundItemDetailById: (id: number) => get<FoundDetail>(`/found-item-detail/${id}`),

  // 创建招领信息
  createFoundItem: (data: Omit<FoundItem, 'id'>) => post<FoundItem>('/found-items', data),

  // 更新招领信息
  updateFoundItem: (id: number, data: Partial<FoundItem>) =>
    put<FoundItem>(`/found-items/${id}`, data),

  // 删除招领信息
  deleteFoundItem: (id: number) => remove<void>(`/found-items/${id}`),
};

// 公告相关 API
export const announcementApi = {
  // 获取公告列表
  getAnnouncements: () => get<Announcement[]>('/announcements'),

  // 获取公告列表（Top 3）
  getAnnouncementsTop3: () => get<Announcement[]>('/announcements-top3'),

  // 获取公告详情
  getAnnouncementDetailById: (id: number) => get<AnnouncementDetail>(`/announcement-detail/${id}`),

  // 创建公告（管理员）
  createAnnouncement: (data: Omit<Announcement, 'id'>) =>
    post<Announcement>('/announcements', data),

  // 更新公告（管理员）
  updateAnnouncement: (id: number, data: Partial<Announcement>) =>
    put<Announcement>(`/announcements/${id}`, data),

  // 删除公告（管理员）
  deleteAnnouncement: (id: number) => remove<void>(`/announcements/${id}`),
};

// 用户相关 API
export const userApi = {
  // 登录
  login: (credentials: { username: string; password: string }) =>
    post<{ token: string; user: unknown }>('/auth/login', credentials),

  // 注册
  register: (data: { username: string; password: string; email: string }) =>
    post<{ token: string; user: unknown }>('/auth/register', data),

  // 获取当前用户信息
  getCurrentUser: () => get<unknown>('/auth/me'),

  // 更新用户信息
  updateUser: (data: unknown) => put<unknown>('/auth/me', data),
};

export const categoryApi = {
  // 获取分类列表
  getCategories: () => get<Category[]>('/categories'),
};

// 导出所有 API
export default {
  lost: lostApi,
  found: foundApi,
  announcement: announcementApi,
  user: userApi,
  category: categoryApi,
};
