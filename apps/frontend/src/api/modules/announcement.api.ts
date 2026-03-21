import { get, post, put, remove } from '../client';
import {
  Announcement,
  AnnouncementDetail,
  GetAnnouncementsParams,
  PageResponse,
} from '@lostfound/shared';

export const announcementApi = {
  getAnnouncements: (params?: GetAnnouncementsParams) =>
    get<PageResponse<Announcement>>('/announcements', { params }),

  getAnnouncementsAll: () => get<Announcement[]>('/announcements/all'),

  getAnnouncementsTop: (count?: number) =>
    get<Announcement[]>('/announcements/top', {
      params: count === undefined ? undefined : { limit: count },
    }),

  getAnnouncementsTop3: () => announcementApi.getAnnouncementsTop(3),

  getAnnouncementDetailById: (id: number) => get<AnnouncementDetail>(`/announcements/${id}`),

  createAnnouncement: (data: Partial<Announcement>) => post<Announcement>('/announcements', data),

  updateAnnouncement: (id: number, data: Partial<Announcement>) =>
    put<Announcement>(`/announcements/${id}`, data),

  deleteAnnouncement: (id: number) => remove<void>(`/announcements/${id}`),
};

export default announcementApi;
