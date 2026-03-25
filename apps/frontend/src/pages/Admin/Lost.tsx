import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOST_STATUS_NAME, LOST_STATUS } from '@lostfound/shared';
import { adminApi } from '@/api';
import { adminKeys } from '@/keys/admin';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLost() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: adminKeys.lost(),
    queryFn: () => adminApi.getAllLostItems(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: adminKeys.categories(),
    queryFn: () => adminApi.getAllCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteLostItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lost() });
      toast.success('删除成功');
    },
    onError: () => {
      toast.error('删除失败');
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm('确定要删除这条失物信息吗？')) return;
    deleteMutation.mutate(id);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.code === Number(statusFilter);
    const matchesCategory =
      categoryFilter === 'all' || item.category?.id === Number(categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">失物管理</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Input
          placeholder="搜索失物..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value={String(LOST_STATUS.寻找中)}>
              {LOST_STATUS_NAME[LOST_STATUS.寻找中]}
            </SelectItem>
            <SelectItem value={String(LOST_STATUS.已找到)}>
              {LOST_STATUS_NAME[LOST_STATUS.已找到]}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <div className="space-x-2 flex items-center">
                  <Badge
                    variant={item.status.code === LOST_STATUS.寻找中 ? 'destructive' : 'secondary'}>
                    {item.status.name}
                  </Badge>
                  <Link to={`/lost/${item.id}`}>
                    <Button size="sm" variant="outline">
                      查看
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteMutation.isPending}>
                    删除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-1">
                <p>分类: {item.category?.name || '未分类'}</p>
                <p>描述: {item.description}</p>
                <p>丢失地点: {item.location}</p>
                <p>丢失时间: {item.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? '未找到匹配的失物'
              : '暂无失物记录'}
          </p>
        )}
      </div>
    </div>
  );
}
