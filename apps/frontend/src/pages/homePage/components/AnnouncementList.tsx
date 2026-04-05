import { Announcement } from '@lostfound/shared';
import { Link } from 'react-router-dom';

export default function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">公告中心</h2>
        <Link to="/announcements" className="text-primary hover:underline flex items-center">
          查看全部 <span className="ml-1">→</span>
        </Link>
      </div>
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b border-border pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-foreground">{announcement.title}</h3>
                <span className="text-xs text-muted-foreground">{announcement.time}</span>
              </div>
              <p className="text-muted-foreground mt-2">{announcement.content}</p>
              <Link
                to={`/announcements/${announcement.id}`}
                className="mt-2 inline-block text-primary hover:underline text-sm">
                查看详情
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
