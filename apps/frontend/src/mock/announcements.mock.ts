import { defineMock } from 'vite-plugin-mock-dev-server';
import { announcementData } from './mock-data';
export default defineMock({
  url: '/mock/announcements-top3',
  method: 'GET',
  body: () => ({
    code: 200,
    message: 'success',
    data: announcementData.announcementsTop3,
  }),
});
