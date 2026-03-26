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
import { FoundItemStatus, FOUND_STATUS_NAME } from '@lostfound/shared';
import { adminApi } from '@/api';
import { adminKeys } from '@/keys/admin';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchInput } from '@/components/searchInput/searchInput';

export default function AdminFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: adminKeys.found(),
    queryFn: () => adminApi.getAllFoundItems(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: adminKeys.categories(),
    queryFn: () => adminApi.getAllCategories(),
  });

  const softDeleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.softDeleteFoundItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.found() });
      toast.success('删除成功');
    },
    onError: () => {
      toast.error('删除失败');
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm('确定要删除这条招领信息吗？')) return;
    softDeleteMutation.mutate(id);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === Number(statusFilter);
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
      <h1 className="text-2xl font-bold mb-6">招领管理</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <SearchInput
          showLabel={false}
          placeholder="搜索招领..."
          value={searchQuery}
          onSearch={(value) => setSearchQuery(value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value={String(FoundItemStatus.招领中)}>
              {FOUND_STATUS_NAME[FoundItemStatus.招领中]}
            </SelectItem>
            <SelectItem value={String(FoundItemStatus.已归还)}>
              {FOUND_STATUS_NAME[FoundItemStatus.已归还]}
            </SelectItem>
            <SelectItem value={String(FoundItemStatus.已撤销)}>
              {FOUND_STATUS_NAME[FoundItemStatus.已撤销]}
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
                  <Badge variant={item.status === FoundItemStatus.招领中 ? 'default' : 'secondary'}>
                    {FOUND_STATUS_NAME[item.status]}
                  </Badge>
                  <Link to={`/found/${item.id}`}>
                    <Button size="sm" variant="outline">
                      查看
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                    disabled={softDeleteMutation.isPending}>
                    删除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-1">
                <p>分类: {item.category?.name || '未分类'}</p>
                <p>描述: {item.description}</p>
                <p>捡到地点: {item.location}</p>
                <p>捡到时间: {item.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? '未找到匹配的招领'
              : '暂无招领记录'}
          </p>
        )}
      </div>
    </div>
  );
}
