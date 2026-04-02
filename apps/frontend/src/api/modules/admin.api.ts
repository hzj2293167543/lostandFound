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
  PageResponse,
  ReportVo as Report,
  HandleReportDto,
  ReportPaginationParams,
  Punishment,
  LocationStats,
  HourlyDistribution,
  WeeklyDistribution,
  MonthlyDistribution,
  UserActivityRanking,
  CommentTrend,
  ReportHandlingStats,
  FunnelData,
  WordCloudData,
} from '@lostfound/shared';
import { buildSearchParams } from '@/utils';

interface RecentItem {
  id: number;
  title: string;
  time: string;
}

export const adminApi = {
  getStats: (config?: AxiosRequestConfig) => get<AdminStats>('/admin/stats', config),

  getTopLocations: (type: 'lost' | 'found', limit?: number, config?: AxiosRequestConfig) =>
    get<LocationStats[]>(`/admin/stats/locations/${type}${limit ? `?limit=${limit}` : ''}`, config),

  getHourlyDistribution: (type: 'lost' | 'found', days?: number, config?: AxiosRequestConfig) =>
    get<HourlyDistribution[]>(`/admin/stats/hourly/${type}${days ? `?days=${days}` : ''}`, config),

  getWeeklyDistribution: (days?: number, config?: AxiosRequestConfig) =>
    get<WeeklyDistribution[]>(`/admin/stats/weekly${days ? `?days=${days}` : ''}`, config),

  getMonthlyDistribution: (months?: number, config?: AxiosRequestConfig) =>
    get<MonthlyDistribution[]>(`/admin/stats/monthly${months ? `?months=${months}` : ''}`, config),

  getUserActivityRanking: (
    type: 'lost' | 'found' | 'comment',
    limit?: number,
    config?: AxiosRequestConfig
  ) =>
    get<UserActivityRanking[]>(
      `/admin/stats/user-activity/${type}${limit ? `?limit=${limit}` : ''}`,
      config
    ),

  getCommentTrend: (days?: number, config?: AxiosRequestConfig) =>
    get<CommentTrend[]>(`/admin/stats/comment-trend${days ? `?days=${days}` : ''}`, config),

  getReportHandlingStats: (config?: AxiosRequestConfig) =>
    get<ReportHandlingStats>('/admin/stats/report-handling', config),

  getFunnelData: (config?: AxiosRequestConfig) => get<FunnelData>('/admin/stats/funnel', config),

  getWordCloudData: (limit?: number, config?: AxiosRequestConfig) =>
    get<WordCloudData>(`/admin/stats/wordcloud${limit ? `?limit=${limit}` : ''}`, config),

  getRecentLostItems: (config?: AxiosRequestConfig) =>
    get<RecentItem[]>('/admin/lost/recent', config),

  getRecentFoundItems: (config?: AxiosRequestConfig) =>
    get<RecentItem[]>('/admin/found/recent', config),

  getAllUsers: (config?: AxiosRequestConfig) =>
    get<(User & { deletedAt?: Date })[]>('/admin/users', config),

  getUsersPaginated: (page: number, pageSize: number) =>
    get<PageResponse<User>>(`/admin/users/paginated?page=${page}&pageSize=${pageSize}`),

  updateUserStatus: (userId: number, status: number) =>
    put<User>(`/admin/users/${userId}/status`, { status }),

  softDeleteUser: (id: number) => remove<void>(`/admin/users/${id}`),

  restoreUser: (id: number) => post<void>(`/admin/users/${id}/restore`, {}),

  getAllLostItems: (config?: AxiosRequestConfig) => get<LostItem[]>('/admin/lost', config),

  getLostItemsPaginated: (page: number, pageSize: number) =>
    get<PageResponse<LostItem>>(`/admin/lost/paginated?page=${page}&pageSize=${pageSize}`),

  softDeleteLostItem: (id: number) => remove<void>(`/admin/lost/${id}`),

  restoreLostItem: (id: number) => post<void>(`/admin/lost/${id}/restore`, {}),

  getAllFoundItems: (config?: AxiosRequestConfig) => get<FoundItem[]>('/admin/found', config),

  getFoundItemsPaginated: (page: number, pageSize: number) =>
    get<PageResponse<FoundItem>>(`/admin/found/paginated?page=${page}&pageSize=${pageSize}`),

  softDeleteFoundItem: (id: number) => remove<void>(`/admin/found/${id}`),

  restoreFoundItem: (id: number) => post<void>(`/admin/found/${id}/restore`, {}),

  getAllCategories: (config?: AxiosRequestConfig) =>
    get<(Category & { defaultSince?: Date })[]>('/admin/categories', config),

  createCategory: (name: string) => post<Category>('/admin/categories', { name }),

  updateCategory: (id: number, name: string) => put<Category>(`/admin/categories/${id}`, { name }),

  deleteCategory: (id: number) =>
    remove<{ success: boolean; message: string }>(`/admin/categories/${id}`),

  getAllAnnouncements: (config?: AxiosRequestConfig) =>
    get<Announcement[]>('/admin/announcements', config),

  getAnnouncementsPaginated: (page: number, pageSize: number) =>
    get<PageResponse<Announcement>>(
      `/admin/announcements/paginated?page=${page}&pageSize=${pageSize}`
    ),

  createAnnouncement: (data: Partial<AnnouncementCreateDto>) =>
    post<Announcement>('/admin/announcements', data),

  updateAnnouncement: (id: number, data: Partial<AnnouncementEditDto>) =>
    patch<Announcement>(`/admin/announcements/${id}`, data),

  deleteAnnouncement: (id: number) => remove<void>(`/admin/announcements/${id}`),

  getReportStats: () =>
    get<{ pending: number; approved: number; rejected: number; total: number }>(
      '/admin/reports/stats'
    ),

  getReportsPaginated: (params: ReportPaginationParams) => {
    const searchParams = buildSearchParams(params);
    return get<PageResponse<Report>>(`/admin/reports/paginated?${searchParams}`);
  },

  handleUserReport: (id: number, data: HandleReportDto) =>
    post<Report>(`/admin/reports/user/${id}/handle`, data),

  handleCommentReport: (id: number, data: HandleReportDto) =>
    post<Report>(`/admin/reports/comment/${id}/handle`, data),

  handleLostReport: (id: number, data: HandleReportDto) =>
    post<Report>(`/admin/reports/lost/${id}/handle`, data),

  handleFoundReport: (id: number, data: HandleReportDto) =>
    post<Report>(`/admin/reports/found/${id}/handle`, data),

  revokePunishment: (id: number) => remove<void>(`/admin/punishments/${id}`),

  getUserPunishments: (userId: number) => get<Punishment[]>(`/admin/users/${userId}/punishments`),
};

export default adminApi;
