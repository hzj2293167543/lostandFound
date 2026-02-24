import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

// 模拟招领数据
const mockFoundItems = [
  {
    id: 1,
    title: '白色AirPods',
    category: '电子产品',
    description: '白色AirPods耳机，带充电盒，于2024年2月20日在操场捡到',
    time: '2024-02-20',
    location: '操场',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20AirPods%20with%20charging%20case&image_size=square',
    user: {
      id: 1,
      name: '张三',
      avatar:
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square',
    },
    comments: 3,
  },
  {
    id: 2,
    title: '数学课本',
    category: '学习用品',
    description: '高等数学上册，封面有笔记，于2024年2月19日在教室302捡到',
    time: '2024-02-19',
    location: '教室302',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematics%20textbook%20college%20level&image_size=square',
    user: {
      id: 2,
      name: '李四',
      avatar:
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20female%20student&image_size=square',
    },
    comments: 2,
  },
  {
    id: 3,
    title: '运动水杯',
    category: '生活用品',
    description: '蓝色运动水杯，带刻度，于2024年2月18日在体育馆捡到',
    time: '2024-02-18',
    location: '体育馆',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20sports%20water%20bottle%20with%20scale&image_size=square',
    user: {
      id: 3,
      name: '王五',
      avatar:
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student%20glasses&image_size=square',
    },
    comments: 1,
  },
  {
    id: 4,
    title: '黑色钱包',
    category: '证件卡包',
    description: '黑色皮质钱包，内有身份证、学生证和银行卡，于2024年2月17日在食堂二楼捡到',
    time: '2024-02-17',
    location: '食堂二楼',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20leather%20wallet%20men%20style&image_size=square',
    user: {
      id: 4,
      name: '赵六',
      avatar:
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20female%20student%20smile&image_size=square',
    },
    comments: 4,
  },
  {
    id: 5,
    title: '红色雨伞',
    category: '生活用品',
    description: '折叠式红色雨伞，伞柄有小熊图案，于2024年2月16日在教学楼A座捡到',
    time: '2024-02-16',
    location: '教学楼A座',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20foldable%20umbrella%20bear%20pattern&image_size=square',
    user: {
      id: 5,
      name: '孙七',
      avatar:
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student%20casual&image_size=square',
    },
    comments: 0,
  },
];

// 物品分类
const categories = ['电子产品', '证件卡包', '生活用品', '服饰', '学习用品', '其他'];

function FoundPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);

  // 发布招领信息
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该处理表单提交逻辑
    setOpen(false);
    // 模拟提交成功后刷新页面
    alert('招领信息发布成功！');
  };

  // 筛选招领
  const filteredItems = mockFoundItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">失物招领</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">发布招领信息</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>发布招领信息</DialogTitle>
              <DialogDescription>请详细填写招领信息，帮助物品早日回家</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">物品名称</Label>
                <Input id="title" placeholder="请输入物品名称" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">物品分类</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">详细描述</Label>
                <Textarea id="description" placeholder="请详细描述物品特征、捡到情况等" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">捡到时间</Label>
                <Input id="time" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">捡到地点</Label>
                <Input id="location" placeholder="请输入捡到的地点" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">图片上传</Label>
                <Input id="image" type="file" accept="image/*" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  发布
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">搜索</Label>
            <Input
              id="search"
              placeholder="搜索物品名称或描述"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-category">分类</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="filter-category">
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部分类</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 招领列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>分类：{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>捡到时间：{item.time}</p>
                <p>捡到地点：{item.location}</p>
              </div>
              <div className="flex items-center mt-4">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-gray-700">{item.user.name}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/found/${item.id}`} className="text-green-600 hover:underline">
                查看详情
              </Link>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">{item.comments} 条评论</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">没有找到匹配的招领信息</p>
        </div>
      )}
    </div>
  );
}

export default FoundPage;
