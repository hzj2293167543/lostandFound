import { Announcement as AnnouncementVo } from '@lostfound/shared';
import { Announcement } from './entities/announcement.entity';

export function mapAnnouncementToVo(announcement: Announcement): AnnouncementVo {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    time: announcement.time.toISOString(),
    author: {
      id: announcement.author.id,
      name: announcement.author.name,
    },
  };
}
