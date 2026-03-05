import { defineMock } from 'vite-plugin-mock-dev-server';
import { announcementData } from './mock-data';

const getAnnouncementsTop3 = defineMock({
  url: '/mock/announcements-top3',
  method: 'GET',
  body: () => ({
    code: 200,
    message: 'success',
    data: announcementData.announcementsTop3,
  }),
});

const getAnnouncements = defineMock({
  url: '/mock/announcements',
  method: 'GET',
  body: () => ({
    code: 200,
    message: 'success',
    data: announcementData.announcements,
  }),
});

const getAnnouncementDetail = defineMock({
  url: '/mock/announcement-detail/:id',
  method: 'GET',
  body: (req) => {
    const id = Number(req.params.id);
    const announcementDetail = announcementData.announcementDetails.find((item) => item.id === id);
    if (!announcementDetail) {
      return {
        code: 404,
        message: 'announcement not found',
        data: null,
      };
    }
    return {
      code: 200,
      message: 'success',
      data: announcementDetail,
    };
  },
});

export default [getAnnouncementsTop3, getAnnouncements, getAnnouncementDetail];
