import { announcementApi } from '@/api';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function announcementDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    const [announcementDetail, announcementTop3] = await Promise.all([
      announcementApi.getAnnouncementDetailById(id),
      announcementApi.getAnnouncementsTop3(),
    ]);
    return {
      announcementDetail,
      announcementTop3,
    };
  } catch {
    throw new Response('Announcement not found', { status: 404 });
  }
}
