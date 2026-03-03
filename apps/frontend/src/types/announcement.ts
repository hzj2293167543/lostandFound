export interface Announcement {
  id: number;
  title: string;
  content: string;
  time: string;
  author: string;
}

interface Attachment {
  id: number;
  name: string;
  size: string;
  url: string;
}

export interface AnnouncementDetail extends Announcement {
  attachments: Attachment[];
}
