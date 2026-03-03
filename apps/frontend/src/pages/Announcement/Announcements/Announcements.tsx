import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Announcement } from '@/types';
import { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');
  const announcements = useLoaderData() as { announcements: Announcement[] };

  // 搜索公告
  const filteredAnnouncements = useMemo(
    () =>
      announcements.announcements.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">公告中心</h1>
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="search">搜索公告</Label>
          <Input
            id="search"
            placeholder="搜索公告标题或内容"
            value={searchTerm}
            onChange={handleChange}
            // onCompositionStart={handleCompositionStart}
            // onCompositionEnd={handleCompositionEnd}
          />
        </div>
      </div>

      {/* 公告列表 */}
      <div className="space-y-6">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
              </div>
              <CardDescription>
                发布时间：{announcement.time} | 发布者：{announcement.author}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-3">{announcement.content}</p>
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

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">没有找到匹配的公告</p>
        </div>
      )}
    </div>
  );
}
