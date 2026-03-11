import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FoundItem } from '@lostfound/shared';
import { foundApi } from '@/api';
import { toast } from 'sonner';

export default function AdminFound() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await foundApi.getFoundItems();
        setItems(data);
      } catch (error) {
        console.error('获取招领列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条招领信息吗？')) return;

    try {
      await foundApi.deleteFoundItem(id);
      setItems(items.filter((item) => item.id !== id));
      toast.success('删除成功');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">招领管理</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <div className="space-x-2">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                    删除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-1">
                <p>分类: {item.category.name}</p>
                <p>描述: {item.description}</p>
                <p>捡到地点: {item.location}</p>
                <p>捡到时间: {item.time}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span>状态:</span>
                  <Badge variant={item.status.code === 0 ? 'default' : 'secondary'}>
                    {item.status.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-gray-500">暂无招领记录</p>}
      </div>
    </div>
  );
}
