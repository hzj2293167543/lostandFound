import { useCallback, useMemo, useRef, useState } from 'react';
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
import { LOST_STATUS_NAME, LostItemStatus } from '@lostfound/shared';
import { adminApi } from '@/api';
import { adminKeys } from '@/keys/admin';
import { toast } from 'sonner';
import { Loader2, SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchInput } from '@/components/searchInput/searchInput';
import { useAdminInfiniteLostItems } from '@/hooks/useAdminInfinite';
const ITEM_HEIGHT = 250;
const PAGE_SIZE = 20;
export default function AdminLost() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminInfiniteLostItems(PAGE_SIZE);
  const items = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

  const { data: categories = [] } = useQuery({
    queryKey: adminKeys.categories(),
    queryFn: () => adminApi.getAllCategories(),
  });

  const softDeleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.softDeleteLostItem(id),
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

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 500;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });
  const renderItemRow = useCallback(
    (item: (typeof filteredItems)[0]) => {
      return (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <div className="space-x-2 flex items-center">
                <Badge
                  variant={item.status === LostItemStatus.寻找中 ? 'destructive' : 'secondary'}>
                  {LOST_STATUS_NAME[item.status]}
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
              <p>丢失地点: {item.location}</p>
              <p>丢失时间: {item.time}</p>
            </div>
          </CardContent>
        </Card>
      );
    },
    [softDeleteMutation]
  );

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
        <SearchInput
          showLabel={false}
          placeholder="搜索失物..."
          value={searchQuery}
          onSearch={setSearchQuery}
          className="text-gray-400"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value={String(LostItemStatus.寻找中)}>
              {LOST_STATUS_NAME[LostItemStatus.寻找中]}
            </SelectItem>
            <SelectItem value={String(LostItemStatus.已找到)}>
              {LOST_STATUS_NAME[LostItemStatus.已找到]}
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
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? '未找到匹配的失物'
              : '暂无失物记录'}
          </p>
        ) : (
          <div ref={parentRef} onScroll={handleScroll} className="h-[650px] overflow-auto">
            <div className={`w-full relative h-[${rowVirtualizer.getTotalSize()}px]`}>
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const item = filteredItems[virtualItem.index];
                if (!item) return null;
                return (
                  <div
                    key={virtualItem.key}
                    className={`w-full absolute top-0 left-0 pb-16 transform`}
                    style={{
                      transform: `translateY(${virtualItem.start}px)`,
                    }}>
                    {renderItemRow(item)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
