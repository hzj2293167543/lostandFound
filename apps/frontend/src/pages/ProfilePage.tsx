import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// 模拟用户数据
const mockUser = {
  id: 1,
  name: '张三',
  avatar:
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
  email: 'zhangsan@example.com',
  phone: '138****1234',
  description: '计算机科学与技术专业，热爱编程和运动',
  joinedAt: '2023-09-01',
};

// 模拟用户发布的失物信息
const mockUserLostItems = [
  {
    id: 1,
    title: '蓝色笔记本电脑',
    category: '电子产品',
    time: '2024-02-20',
    status: '寻找中',
  },
  {
    id: 2,
    title: '红色雨伞',
    category: '生活用品',
    time: '2024-02-18',
    status: '已找到',
  },
];

// 模拟用户发布的招领信息
const mockUserFoundItems = [
  {
    id: 1,
    title: '白色AirPods',
    category: '电子产品',
    time: '2024-02-20',
    status: '招领中',
  },
];

function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [formData, setFormData] = useState(mockUser);

  // 打开编辑对话框
  const handleEditProfile = () => {
    setFormData({ ...user });
    setOpen(true);
  };

  // 保存用户信息
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...formData });
    setOpen(false);
    alert('个人信息更新成功！');
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">个人中心</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧个人信息 */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-md">
                    <span className="text-sm">更换</span>
                  </button>
                </div>
                <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                <p className="text-gray-500 mb-4">{user.email}</p>
                <p className="text-gray-600 text-center mb-6">{user.description}</p>
                <Button className="w-full" onClick={handleEditProfile}>
                  编辑个人信息
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full">
                退出登录
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>账户统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">发布失物信息</span>
                  <span className="font-semibold">{mockUserLostItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">发布招领信息</span>
                  <span className="font-semibold">{mockUserFoundItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">已找到物品</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">帮助他人找回</span>
                  <span className="font-semibold">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧内容 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="lost">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lost">我的失物</TabsTrigger>
              <TabsTrigger value="found">我的招领</TabsTrigger>
              <TabsTrigger value="comments">我的评论</TabsTrigger>
              <TabsTrigger value="settings">账户设置</TabsTrigger>
            </TabsList>
            <TabsContent value="lost" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">我的失物信息</h2>
              <div className="space-y-6">
                {mockUserLostItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>
                        分类：{item.category} | 发布时间：{item.time}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${item.status === '寻找中' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {item.status}
                      </span>
                      <Button variant="outline" className="ml-auto">
                        查看详情
                      </Button>
                      <Button variant="outline" className="ml-2">
                        编辑
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="found" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">我的招领信息</h2>
              <div className="space-y-6">
                {mockUserFoundItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>
                        分类：{item.category} | 发布时间：{item.time}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${item.status === '招领中' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {item.status}
                      </span>
                      <Button variant="outline" className="ml-auto">
                        查看详情
                      </Button>
                      <Button variant="outline" className="ml-2">
                        编辑
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">我的评论</h2>
              <Card>
                <CardContent>
                  <p className="text-gray-600 text-center py-12">暂无评论记录</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">账户设置</h2>
              <Card>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号码</Label>
                      <Input id="phone" value={user.phone} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱地址</Label>
                      <Input id="email" value={user.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joined">注册时间</Label>
                      <Input id="joined" value={user.joinedAt} disabled />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">修改密码</Button>
                  <Button className="ml-auto">绑定第三方账号</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 编辑个人信息对话框 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑个人信息</DialogTitle>
            <DialogDescription>请修改你的个人信息</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">手机号码</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">个人描述</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
