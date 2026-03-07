import { Announcement } from '@lostfound/schema';
import { Link } from 'react-router-dom';

export default function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">公告中心</h2>
        <Link to="/announcements" className="text-blue-600 hover:underline flex items-center">
          查看全部 <span className="ml-1">→</span>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-800">{announcement.title}</h3>
                <span className="text-xs text-gray-500">{announcement.time}</span>
              </div>
              <p className="text-gray-600 mt-2">{announcement.content}</p>
              <Link
                to={`/announcements/${announcement.id}`}
                className="mt-2 inline-block text-blue-600 hover:underline text-sm">
                查看详情
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
