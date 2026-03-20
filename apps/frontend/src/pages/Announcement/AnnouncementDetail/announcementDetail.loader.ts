import { announcementApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { announcementKeys } from '@/queryKeys';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function announcementDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const id = Number(params.id);
    const [announcementDetail, announcementTop3] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: announcementKeys.detail(id),
        queryFn: () => announcementApi.getAnnouncementDetailById(id),
      }),
      queryClient.ensureQueryData({
        queryKey: announcementKeys.listTop3(),
        queryFn: () => announcementApi.getAnnouncementsTop3(),
      }),
    ]);
    return {
      announcementDetail,
      announcementTop3,
    };
  } catch {
    throw new Response('Announcement not found', { status: 404 });
  }
}
