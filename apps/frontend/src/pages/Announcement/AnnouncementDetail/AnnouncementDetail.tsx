import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Announcement, AnnouncementDetail } from '@lostfound/shared';
import { Link, useLoaderData } from 'react-router-dom';

export default function AnnouncementDetailPage() {
  const { announcementDetail, announcementTop3 } = useLoaderData() as {
    announcementDetail: AnnouncementDetail;
    announcementTop3: Announcement[];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/announcements" className="text-blue-600 hover:underline flex items-center mr-4">
          <span>←</span> 返回公告列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">公告详情</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{announcementDetail.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-4">
              <span>发布时间：{announcementDetail.time}</span>
              <span>发布者：{announcementDetail.author.name}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 space-y-4 whitespace-pre-line">
            {announcementDetail.content}
          </div>

          {/* 附件 */}
          {/* {announcementDetail.attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-4">附件</h3>
              <div className="space-y-2">
                {announcementDetail.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{attachment.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{attachment.size}</span>
                      <Button variant="link" className="text-blue-600">
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </CardContent>
        <CardFooter>
          <Link to="/announcements" className="text-blue-600 hover:underline">
            返回公告列表
          </Link>
        </CardFooter>
      </Card>

      {/* 最新公告 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">最新公告</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcementTop3
            .filter((announcement) => announcement.id !== announcementDetail.id)
            .slice(0, 2)
            .map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>{announcement.time}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{announcement.content}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    to={`/announcements/${announcement.id}`}
                    className="text-blue-600 hover:underline">
                    查看详情
                  </Link>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
