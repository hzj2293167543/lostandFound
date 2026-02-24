import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// 模拟失物详情数据
const mockLostDetail = {
  id: 1,
  title: '蓝色笔记本电脑',
  category: '电子产品',
  description:
    '联想小新Pro，蓝色外壳，有轻微划痕，于2024年2月20日在图书馆三楼丢失。电脑内有重要的学习资料和项目文件，希望捡到的同学能够联系我，必有重谢！',
  time: '2024-02-20',
  location: '图书馆三楼',
  status: '寻找中',
  image:
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laptop%20blue%20lenovo%20小新Pro&image_size=landscape_16_9',
  user: {
    id: 1,
    name: '张三',
    avatar:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
    contact: '138****1234',
    description: '计算机科学与技术专业，热爱编程和运动',
  },
  comments: [
    {
      id: 1,
      user: {
        id: 2,
        name: '李四',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20female%20student&image_size=square',
      },
      content: '我昨天在图书馆看到一个蓝色的电脑包，不知道是不是你的？',
      time: '2024-02-20 14:30',
    },
    {
      id: 2,
      user: {
        id: 1,
        name: '张三',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
      },
      content: '是的是的！请问你在哪里看到的？能详细说一下吗？',
      time: '2024-02-20 15:15',
    },
    {
      id: 3,
      user: {
        id: 3,
        name: '王五',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student%20glasses&image_size=square',
      },
      content:
        '我今天在图书馆三楼自习室看到一个蓝色笔记本电脑，已经交给图书馆前台了，你可以去问问。',
      time: '2024-02-21 09:45',
    },
    {
      id: 4,
      user: {
        id: 1,
        name: '张三',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
      },
      content: '太感谢了！我马上去图书馆前台询问，非常感谢大家的帮助！',
      time: '2024-02-21 10:05',
    },
  ],
};

function LostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockLostDetail.comments);

  // 提交评论
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      user: {
        id: 5,
        name: '当前用户',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20default&image_size=square',
      },
      content: comment,
      time: new Date().toLocaleString('zh-CN'),
    };

    setComments([...comments, newComment]);
    setComment('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/lost" className="text-blue-600 hover:underline flex items-center mr-4">
          <span>←</span> 返回失物列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">失物详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧失物详情 */}
        <div className="lg:col-span-2">
          {/* 失物基本信息 */}
          <Card className="mb-8">
            <div className="h-80 overflow-hidden">
              <img
                src={mockLostDetail.image}
                alt={mockLostDetail.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{mockLostDetail.title}</CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${mockLostDetail.status === '寻找中' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {mockLostDetail.status}
                </span>
              </div>
              <CardDescription>分类：{mockLostDetail.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 mb-6">
                <p className="mb-4">{mockLostDetail.description}</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>丢失时间：</strong>
                    {mockLostDetail.time}
                  </p>
                  <p>
                    <strong>可能地点：</strong>
                    {mockLostDetail.location}
                  </p>
                </div>
              </div>

              {/* 发布者信息 */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-4">发布者信息</h3>
                <div className="flex items-center">
                  <img
                    src={mockLostDetail.user.avatar}
                    alt={mockLostDetail.user.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{mockLostDetail.user.name}</h4>
                    <p className="text-sm text-gray-600">{mockLostDetail.user.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      联系方式：{mockLostDetail.user.contact}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-blue-600 hover:bg-blue-700">联系发布者</Button>
              <Button variant="outline">分享信息</Button>
            </CardFooter>
          </Card>

          {/* 评论区 */}
          <Card>
            <CardHeader>
              <CardTitle>评论 ({comments.length})</CardTitle>
              <CardDescription>请文明发言，共同帮助失主找回物品</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 发表评论 */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="space-y-2">
                  <Label htmlFor="comment">发表评论</Label>
                  <Textarea
                    id="comment"
                    placeholder="请输入你的评论..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700">
                  提交评论
                </Button>
              </form>

              {/* 评论列表 */}
              <div className="space-y-6">
                {comments.map((commentItem) => (
                  <div key={commentItem.id} className="flex space-x-4">
                    <img
                      src={commentItem.user.avatar}
                      alt={commentItem.user.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-800">{commentItem.user.name}</h4>
                        <span className="text-xs text-gray-500">{commentItem.time}</span>
                      </div>
                      <p className="text-gray-600">{commentItem.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧相关信息 */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>相关操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/lost">发布失物信息</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link to="/found">查看招领信息</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  举报信息
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>失物招领小提示</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>丢失物品后请尽快发布失物信息，提高找回几率</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>详细描述物品特征和丢失地点，便于他人识别</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>保持联系方式畅通，及时查看评论和消息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>物品找回后请及时更新状态，避免他人重复联系</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LostDetailPage;
