import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// 模拟公告详情数据
const mockAnnouncementDetail = {
  id: 1,
  title: '关于加强校园失物招领管理的通知',
  content: `为了更好地服务广大师生，即日起加强失物招领信息的审核和管理，确保信息的真实性和有效性。现将有关事项通知如下：

一、信息发布要求
1. 发布失物或招领信息时，务必填写真实有效的联系方式，包括姓名、电话等。
2. 信息内容必须真实、准确、完整，不得发布虚假信息。
3. 上传的图片必须清晰可辨，能够准确反映物品的特征。

二、信息审核流程
1. 所有发布的信息将经过后台审核，审核通过后才能在平台上显示。
2. 审核时间一般为1-2个工作日，请耐心等待。
3. 对于审核不通过的信息，系统将通过站内信通知发布者，并说明原因。

三、信息管理
1. 发布者可以在个人中心查看和管理自己发布的信息。
2. 对于已找到失物或已归还招领物品的情况，请及时更新信息状态。
3. 平台有权删除虚假、违规或过期的信息。

四、联系方式
如有任何疑问或建议，请联系平台管理员：
电话：138****1234
邮箱：admin@lostandfound.edu.cn

请各位同学严格遵守以上规定，共同维护良好的平台环境，确保失物招领工作的顺利开展。

特此通知。

校园失物招领平台管理团队
2024年2月20日`,
  time: '2024-02-20',
  author: '管理员',
  importance: 'high',
  attachments: [
    {
      id: 1,
      name: '失物招领平台使用指南.pdf',
      size: '2.5MB',
    },
    {
      id: 2,
      name: '信息发布规范.docx',
      size: '1.2MB',
    },
  ],
};

function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();

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
          <CardTitle className="text-2xl">{mockAnnouncementDetail.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-4">
              <span>发布时间：{mockAnnouncementDetail.time}</span>
              <span>发布者：{mockAnnouncementDetail.author}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${mockAnnouncementDetail.importance === 'high' ? 'bg-red-100 text-red-800' : mockAnnouncementDetail.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                {mockAnnouncementDetail.importance === 'high'
                  ? '重要'
                  : mockAnnouncementDetail.importance === 'medium'
                    ? '中等'
                    : '一般'}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 space-y-4 whitespace-pre-line">
            {mockAnnouncementDetail.content}
          </div>

          {/* 附件 */}
          {mockAnnouncementDetail.attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-4">附件</h3>
              <div className="space-y-2">
                {mockAnnouncementDetail.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{attachment.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{attachment.size}</span>
                      <button className="text-blue-600 hover:underline text-sm">下载</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/announcements" className="text-blue-600 hover:underline">
            返回公告列表
          </Link>
        </CardFooter>
      </Card>

      {/* 相关公告 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">相关公告</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>失物招领平台使用指南</CardTitle>
              <CardDescription>2024-02-10</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-2">
                为了帮助新同学更好地使用失物招领平台，我们制作了详细的使用指南...
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/announcements/4" className="text-blue-600 hover:underline">
                查看详情
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>重要提醒：考试周注意保管个人物品</CardTitle>
              <CardDescription>2024-02-15</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-2">
                考试周期间，图书馆、教室人流量大，请同学们注意保管好个人物品...
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/announcements/3" className="text-blue-600 hover:underline">
                查看详情
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailPage;
