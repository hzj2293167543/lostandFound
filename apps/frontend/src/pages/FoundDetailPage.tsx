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

// 模拟招领详情数据
const mockFoundDetail = {
  id: 1,
  title: '白色AirPods',
  category: '电子产品',
  description:
    '白色AirPods耳机，带充电盒，于2024年2月20日在操场捡到。耳机外观完好，充电盒有轻微划痕。请失主提供详细信息以便确认身份。',
  time: '2024-02-20',
  location: '操场',
  image:
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20AirPods%20with%20charging%20case&image_size=landscape_16_9',
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
      content: '这是我的！我昨天在操场跑步时丢失的，充电盒上有一个小贴纸',
      time: '2024-02-20 15:30',
    },
    {
      id: 2,
      user: {
        id: 1,
        name: '张三',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
      },
      content: '请问贴纸上是什么图案？耳机是什么时候买的？',
      time: '2024-02-20 16:15',
    },
    {
      id: 3,
      user: {
        id: 2,
        name: '李四',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20female%20student&image_size=square',
      },
      content: '贴纸上是一个小猫图案，去年12月买的，有序列号可以提供',
      time: '2024-02-20 16:45',
    },
    {
      id: 4,
      user: {
        id: 1,
        name: '张三',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
      },
      content: '好的，确实是你的，请联系我领取',
      time: '2024-02-20 17:05',
    },
  ],
};

function FoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockFoundDetail.comments);

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
        <Link to="/found" className="text-green-600 hover:underline flex items-center mr-4">
          <span>←</span> 返回招领列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">招领详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧招领详情 */}
        <div className="lg:col-span-2">
          {/* 招领基本信息 */}
          <Card className="mb-8">
            <div className="h-80 overflow-hidden">
              <img
                src={mockFoundDetail.image}
                alt={mockFoundDetail.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{mockFoundDetail.title}</CardTitle>
              <CardDescription>分类：{mockFoundDetail.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 mb-6">
                <p className="mb-4">{mockFoundDetail.description}</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>捡到时间：</strong>
                    {mockFoundDetail.time}
                  </p>
                  <p>
                    <strong>捡到地点：</strong>
                    {mockFoundDetail.location}
                  </p>
                </div>
              </div>

              {/* 发布者信息 */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-4">发布者信息</h3>
                <div className="flex items-center">
                  <img
                    src={mockFoundDetail.user.avatar}
                    alt={mockFoundDetail.user.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{mockFoundDetail.user.name}</h4>
                    <p className="text-sm text-gray-600">{mockFoundDetail.user.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      联系方式：{mockFoundDetail.user.contact}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-green-600 hover:bg-green-700">联系发布者</Button>
              <Button variant="outline">分享信息</Button>
            </CardFooter>
          </Card>

          {/* 评论区 */}
          <Card>
            <CardHeader>
              <CardTitle>评论 ({comments.length})</CardTitle>
              <CardDescription>请文明发言，确认物品信息</CardDescription>
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
                <Button type="submit" className="mt-4 bg-green-600 hover:bg-green-700">
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
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Link to="/found">发布招领信息</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link to="/lost">查看失物信息</Link>
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
                  <span className="text-green-600 mr-2">•</span>
                  <span>捡到物品后请尽快发布招领信息，帮助失主早日找回</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>详细描述物品特征和捡到地点，便于失主识别</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>保持联系方式畅通，及时查看评论和消息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>确认失主身份后再交付物品，避免冒领</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FoundDetailPage;
