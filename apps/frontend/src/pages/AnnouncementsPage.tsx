import { SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// 模拟公告数据
const mockAnnouncements = [
  {
    id: 1,
    title: '关于加强校园失物招领管理的通知',
    content:
      '为了更好地服务广大师生，即日起加强失物招领信息的审核和管理，确保信息的真实性和有效性。请各位同学在发布信息时务必填写真实有效的联系方式，以便失物能够及时归还。',
    time: '2024-02-20',
    author: '管理员',
    importance: 'high',
  },
  {
    id: 2,
    title: '本周失物招领统计',
    content:
      '本周共收到失物信息23条，招领信息18条，已成功匹配12条。其中电子产品类物品丢失最多，占比45%；其次是证件卡包类，占比25%。请同学们注意保管好个人物品。',
    time: '2024-02-18',
    author: '管理员',
    importance: 'medium',
  },
  {
    id: 3,
    title: '重要提醒：考试周注意保管个人物品',
    content:
      '考试周期间，图书馆、教室人流量大，请同学们注意保管好个人物品，特别是身份证、学生证、银行卡等重要证件。如有物品丢失，请及时在平台发布信息。',
    time: '2024-02-15',
    author: '管理员',
    importance: 'high',
  },
  {
    id: 4,
    title: '失物招领平台使用指南',
    content:
      '为了帮助新同学更好地使用失物招领平台，我们制作了详细的使用指南。请同学们在发布信息时仔细阅读平台规则，确保信息的准确性和完整性。',
    time: '2024-02-10',
    author: '管理员',
    importance: 'medium',
  },
  {
    id: 5,
    title: '关于开展失物招领志愿服务活动的通知',
    content:
      '为了进一步提升校园失物招领服务质量，我们计划开展失物招领志愿服务活动，欢迎有热心的同学报名参加。志愿者将协助管理失物招领信息，帮助失主找回物品。',
    time: '2024-02-05',
    author: '管理员',
    importance: 'low',
  },
];

function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // 搜索公告
  const filteredAnnouncements = mockAnnouncements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
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
                <span
                  className={`px-3 py-1 rounded-full text-sm ${announcement.importance === 'high' ? 'bg-red-100 text-red-800' : announcement.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {announcement.importance === 'high'
                    ? '重要'
                    : announcement.importance === 'medium'
                      ? '中等'
                      : '一般'}
                </span>
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

export default AnnouncementsPage;
